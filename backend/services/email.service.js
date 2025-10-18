const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const { Client } = require('@microsoft/microsoft-graph-client');
const { ClientSecretCredential } = require('@azure/identity');
const Imap = require('imap');
const { simpleParser } = require('mailparser');
const emailConfig = require('../config/email.config');

class EmailService {
  constructor() {
    this.smtp = nodemailer.createTransport(emailConfig.smtp);
  }

  /**
   * Send report email to user
   */
  async sendReportEmail(to, testCode, reportUrl, summary) {
    const { getReportEmailTemplate } = require('../utils/emailTemplates');
    
    try {
      const mailOptions = {
        from: `"Email Deliverability Tool" <${process.env.SMTP_USER}>`,
        to: to,
        subject: `Your Email Deliverability Report - ${testCode}`,
        html: getReportEmailTemplate(testCode, reportUrl, summary)
      };

      const info = await this.smtp.sendMail(mailOptions);
      console.log(`Report email sent: ${info.messageId}`);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Error sending report email:', error);
      throw error;
    }
  }

  /**
   * Get Gmail OAuth2 client
   */
  getGmailOAuth2Client(credentials) {
    const oauth2Client = new google.auth.OAuth2(
      credentials.clientId,
      credentials.clientSecret,
      'https://developers.google.com/oauthplayground'
    );

    oauth2Client.setCredentials({
      refresh_token: credentials.refreshToken
    });

    return oauth2Client;
  }

  /**
   * Check Gmail inbox for email with test code
   */
  async checkGmailInbox(credentials, testCode) {
    try {
      const auth = this.getGmailOAuth2Client(credentials);
      const gmail = google.gmail({ version: 'v1', auth });

      // Search for emails with test code
      const response = await gmail.users.messages.list({
        userId: 'me',
        q: `"${testCode}" newer_than:1d`,
        maxResults: 10
      });

      if (!response.data.messages || response.data.messages.length === 0) {
        return { found: false, folder: 'not_found' };
      }

      const messageId = response.data.messages[0].id;
      const message = await gmail.users.messages.get({
        userId: 'me',
        id: messageId
      });

      // Determine folder based on labels
      const labels = message.data.labelIds || [];
      let folder = 'inbox';

      if (labels.includes('SPAM')) {
        folder = 'spam';
      } else if (labels.includes('CATEGORY_PROMOTIONS')) {
        folder = 'promotions';
      } else if (labels.includes('INBOX')) {
        folder = 'inbox';
      }

      return {
        found: true,
        folder: folder,
        receivedAt: new Date(parseInt(message.data.internalDate)),
        messageId: messageId
      };

    } catch (error) {
      console.error('Error checking Gmail:', error);
      throw error;
    }
  }

  /**
   * Get Microsoft Graph client
   */
  getMicrosoftGraphClient(credentials) {
    const credential = new ClientSecretCredential(
      credentials.tenantId,
      credentials.clientId,
      credentials.clientSecret
    );

    return Client.initWithMiddleware({
      authProvider: {
        getAccessToken: async () => {
          const token = await credential.getToken('https://graph.microsoft.com/.default');
          return token.token;
        }
      }
    });
  }

  /**
   * Check Outlook inbox for email with test code
   */
  async checkOutlookInbox(credentials, testCode) {
    try {
      const client = this.getMicrosoftGraphClient(credentials);

      // Search for emails in inbox
      const messages = await client
        .api(`/users/${credentials.user}/messages`)
        .filter(`contains(subject, '${testCode}') or contains(body/content, '${testCode}')`)
        .top(10)
        .get();

      if (!messages.value || messages.value.length === 0) {
        return { found: false, folder: 'not_found' };
      }

      const message = messages.value[0];
      
      // Check if in Junk folder
      const isJunk = message.parentFolderId ? 
        await this.isOutlookJunkFolder(client, credentials.user, message.parentFolderId) : 
        false;

      const folder = isJunk ? 'spam' : 'inbox';

      return {
        found: true,
        folder: folder,
        receivedAt: new Date(message.receivedDateTime),
        messageId: message.id
      };

    } catch (error) {
      console.error('Error checking Outlook:', error);
      throw error;
    }
  }

  /**
   * Check if Outlook folder is Junk Email
   */
  async isOutlookJunkFolder(client, userEmail, folderId) {
    try {
      const folder = await client
        .api(`/users/${userEmail}/mailFolders/${folderId}`)
        .get();
      
      return folder.displayName === 'Junk Email' || folder.displayName === 'Spam';
    } catch (error) {
      return false;
    }
  }

  /**
   * Check Yahoo inbox using IMAP
   */
  async checkYahooInbox(credentials, testCode) {
    return new Promise((resolve, reject) => {
      const imap = new Imap({
        user: credentials.user,
        password: credentials.password,
        host: 'imap.mail.yahoo.com',
        port: 993,
        tls: true,
        tlsOptions: { rejectUnauthorized: false }
      });

      let result = { found: false, folder: 'not_found' };

      imap.once('ready', () => {
        // Check Inbox first
        imap.openBox('INBOX', true, (err, box) => {
          if (err) {
            imap.end();
            return reject(err);
          }

          imap.search([
            ['OR', ['SUBJECT', testCode], ['BODY', testCode]],
            ['SINCE', new Date(Date.now() - 24 * 60 * 60 * 1000)]
          ], (err, results) => {
            if (err) {
              imap.end();
              return reject(err);
            }

            if (results.length > 0) {
              const f = imap.fetch(results[0], { bodies: '' });
              
              f.on('message', (msg) => {
                msg.on('body', (stream) => {
                  simpleParser(stream, (err, parsed) => {
                    if (!err) {
                      result = {
                        found: true,
                        folder: 'inbox',
                        receivedAt: parsed.date || new Date(),
                        messageId: parsed.messageId
                      };
                    }
                  });
                });
              });

              f.once('end', () => {
                imap.end();
              });
            } else {
              // Check Spam folder
              imap.openBox('Bulk Mail', true, (err, box) => {
                if (err) {
                  imap.end();
                  return resolve(result);
                }

                imap.search([
                  ['OR', ['SUBJECT', testCode], ['BODY', testCode]],
                  ['SINCE', new Date(Date.now() - 24 * 60 * 60 * 1000)]
                ], (err, results) => {
                  if (!err && results.length > 0) {
                    result = {
                      found: true,
                      folder: 'spam',
                      receivedAt: new Date(),
                      messageId: results[0]
                    };
                  }
                  imap.end();
                });
              });
            }
          });
        });
      });

      imap.once('error', (err) => {
        reject(err);
      });

      imap.once('end', () => {
        resolve(result);
      });

      imap.connect();
    });
  }

  /**
   * Check inbox based on provider type
   */
  async checkInbox(inbox, testCode) {
    const { type, credentials } = inbox;

    try {
      switch (type) {
        case 'gmail':
          return await this.checkGmailInbox(credentials, testCode);
        case 'outlook':
          return await this.checkOutlookInbox(credentials, testCode);
        case 'yahoo':
          return await this.checkYahooInbox(credentials, testCode);
        default:
          throw new Error(`Unsupported email provider: ${type}`);
      }
    } catch (error) {
      console.error(`Error checking ${type} inbox:`, error);
      return { found: false, folder: 'not_found', error: error.message };
    }
  }
}

module.exports = new EmailService();