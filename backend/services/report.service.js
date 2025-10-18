const Report = require('../models/Report.model');
const Test = require('../models/Test.model');
const emailService = require('./email.service');

class ReportService {
  /**
   * Generate report for a completed test
   */
  async generateReport(testId) {
    try {
      const test = await Test.findById(testId);
      if (!test) {
        throw new Error('Test not found');
      }

      // Calculate summary
      const summary = {
        totalInboxes: test.testInboxes.length,
        inbox: test.testInboxes.filter(i => i.folder === 'inbox').length,
        spam: test.testInboxes.filter(i => i.folder === 'spam').length,
        promotions: test.testInboxes.filter(i => i.folder === 'promotions').length,
        notFound: test.testInboxes.filter(i => i.folder === 'not_found').length,
        deliverabilityScore: test.deliverabilityScore
      };

      // Create report details
      const details = test.testInboxes.map(inbox => ({
        provider: inbox.provider,
        email: inbox.email,
        folder: inbox.folder,
        receivedAt: inbox.receivedAt,
        status: inbox.status
      }));

      // Create or update report
      let report = await Report.findOne({ testId: test._id });
      
      const reportUrl = `${process.env.FRONTEND_URL}/report/${test.testCode}`;

      if (!report) {
        report = new Report({
          testId: test._id,
          testCode: test.testCode,
          userEmail: test.userEmail,
          summary,
          details,
          reportUrl
        });
      } else {
        report.summary = summary;
        report.details = details;
        report.reportUrl = reportUrl;
      }

      await report.save();

      // Update test with report URL
      test.reportUrl = reportUrl;
      await test.save();

      // Send report email
      if (!report.emailSent) {
        try {
          await emailService.sendReportEmail(
            test.userEmail,
            test.testCode,
            reportUrl,
            summary
          );
          
          report.emailSent = true;
          report.emailSentAt = new Date();
          await report.save();
        } catch (error) {
          console.error('Error sending report email:', error);
        }
      }

      return report;
    } catch (error) {
      console.error('Error generating report:', error);
      throw error;
    }
  }

  /**
   * Get report by test code
   */
  async getReportByTestCode(testCode) {
    const report = await Report.findOne({ testCode }).populate('testId');
    if (!report) {
      throw new Error('Report not found');
    }
    return report;
  }

  /**
   * Get reports by user email
   */
  async getReportsByUserEmail(userEmail, limit = 10) {
    const reports = await Report.find({ userEmail })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('testId');
    
    return reports;
  }
}

module.exports = new ReportService();