const emailService = require('./email.service');
const emailConfig = require('../config/email.config');
const Test = require('../models/Test.model');

class DetectionService {
  /**
   * Start detection process for a test
   */
  async startDetection(testId) {
    try {
      const test = await Test.findById(testId);
      if (!test) {
        throw new Error('Test not found');
      }

      test.status = 'processing';
      await test.save();

      // Start checking emails with retries
      await this.checkEmailsWithRetry(test);

      return test;
    } catch (error) {
      console.error('Error in detection service:', error);
      throw error;
    }
  }

  /**
   * Check emails with retry mechanism
   */
  async checkEmailsWithRetry(test, maxRetries = 10, interval = 30000) {
    let retryCount = 0;
    const startTime = Date.now();
    const maxDuration = 5 * 60 * 1000; // 5 minutes

    const checkInterval = setInterval(async () => {
      try {
        retryCount++;
        console.log(`Checking emails - Attempt ${retryCount}/${maxRetries}`);

        // Check each inbox
        for (let i = 0; i < test.testInboxes.length; i++) {
          const inbox = test.testInboxes[i];
          
          // Skip if already detected
          if (inbox.status === 'detected') {
            continue;
          }

          inbox.status = 'checking';
          inbox.checkCount = retryCount;
          inbox.lastCheckedAt = new Date();

          // Get inbox config
          const inboxConfig = emailConfig.testInboxes.find(
            config => config.id === inbox.inboxId
          );

          if (!inboxConfig) {
            inbox.status = 'error';
            inbox.error = 'Inbox configuration not found';
            continue;
          }

          // Check inbox
          const result = await emailService.checkInbox(inboxConfig, test.testCode);

          if (result.found) {
            inbox.status = 'detected';
            inbox.folder = result.folder;
            inbox.receivedAt = result.receivedAt;
          } else if (retryCount >= maxRetries) {
            inbox.status = 'not_found';
            inbox.folder = 'not_found';
          }

          // Save progress
          await test.save();
        }

        // Check if all inboxes are processed
        const allProcessed = test.testInboxes.every(
          inbox => inbox.status === 'detected' || inbox.status === 'not_found' || inbox.status === 'error'
        );

        if (allProcessed || retryCount >= maxRetries || (Date.now() - startTime) > maxDuration) {
          clearInterval(checkInterval);
          
          test.status = 'completed';
          test.completedAt = new Date();
          await test.save();

          console.log('Detection completed for test:', test.testCode);
          
          // Generate report
          const reportService = require('./report.service');
          await reportService.generateReport(test._id);
        }

      } catch (error) {
        console.error('Error in check interval:', error);
        
        if (retryCount >= maxRetries) {
          clearInterval(checkInterval);
          test.status = 'failed';
          await test.save();
        }
      }
    }, interval);
  }
}

module.exports = new DetectionService();