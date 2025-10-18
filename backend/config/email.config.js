module.exports = {
  testInboxes: [
    {
      id: 1,
      email: process.env.GMAIL_1_EMAIL,
      provider: 'Gmail',
      type: 'gmail',
      credentials: {
        user: process.env.GMAIL_1_EMAIL,
        password: process.env.GMAIL_1_PASSWORD,
        clientId: process.env.GMAIL_1_CLIENT_ID,
        clientSecret: process.env.GMAIL_1_CLIENT_SECRET,
        refreshToken: process.env.GMAIL_1_REFRESH_TOKEN
      }
    },
    {
      id: 2,
      email: process.env.GMAIL_2_EMAIL,
      provider: 'Gmail',
      type: 'gmail',
      credentials: {
        user: process.env.GMAIL_2_EMAIL,
        password: process.env.GMAIL_2_PASSWORD,
        clientId: process.env.GMAIL_2_CLIENT_ID,
        clientSecret: process.env.GMAIL_2_CLIENT_SECRET,
        refreshToken: process.env.GMAIL_2_REFRESH_TOKEN
      }
    },
    {
      id: 3,
      email: process.env.OUTLOOK_1_EMAIL,
      provider: 'Outlook',
      type: 'outlook',
      credentials: {
        user: process.env.OUTLOOK_1_EMAIL,
        password: process.env.OUTLOOK_1_PASSWORD,
        clientId: process.env.OUTLOOK_1_CLIENT_ID,
        clientSecret: process.env.OUTLOOK_1_CLIENT_SECRET,
        tenantId: process.env.OUTLOOK_1_TENANT_ID
      }
    },
    {
      id: 4,
      email: process.env.OUTLOOK_2_EMAIL,
      provider: 'Outlook',
      type: 'outlook',
      credentials: {
        user: process.env.OUTLOOK_2_EMAIL,
        password: process.env.OUTLOOK_2_PASSWORD,
        clientId: process.env.OUTLOOK_2_CLIENT_ID,
        clientSecret: process.env.OUTLOOK_2_CLIENT_SECRET,
        tenantId: process.env.OUTLOOK_2_TENANT_ID
      }
    },
    {
      id: 5,
      email: process.env.YAHOO_EMAIL,
      provider: 'Yahoo',
      type: 'yahoo',
      credentials: {
        user: process.env.YAHOO_EMAIL,
        password: process.env.YAHOO_PASSWORD
      }
    }
  ],

  smtp: {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  }
};