const reportService = require('../services/report.service');
const PDFDocument = require('pdfkit');

/**
 * Get report by test code
 */
exports.getReport = async (req, res) => {
  try {
    const { testCode } = req.params;

    const report = await reportService.getReportByTestCode(testCode);

    res.json({
      success: true,
      data: report
    });
  } catch (error) {
    console.error('Error fetching report:', error);
    
    if (error.message === 'Report not found') {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error fetching report',
      error: error.message
    });
  }
};

/**
 * Get user's report history
 */
exports.getReportHistory = async (req, res) => {
  try {
    const { userEmail } = req.query;
    const limit = parseInt(req.query.limit) || 10;

    if (!userEmail) {
      return res.status(400).json({
        success: false,
        message: 'User email is required'
      });
    }

    const reports = await reportService.getReportsByUserEmail(userEmail, limit);

    res.json({
      success: true,
      data: reports
    });
  } catch (error) {
    console.error('Error fetching report history:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching report history',
      error: error.message
    });
  }
};

/**
 * Download report as PDF
 */
exports.downloadReportPDF = async (req, res) => {
  try {
    const { testCode } = req.params;

    const report = await reportService.getReportByTestCode(testCode);

    // Create PDF
    const doc = new PDFDocument({ margin: 50 });

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=report-${testCode}.pdf`);

    // Pipe PDF to response
    doc.pipe(res);

    // Add content
    doc.fontSize(24).text('Email Deliverability Report', { align: 'center' });
    doc.moveDown();

    doc.fontSize(12).text(`Test Code: ${report.testCode}`);
    doc.text(`Date: ${new Date(report.createdAt).toLocaleString()}`);
    doc.text(`User Email: ${report.userEmail}`);
    doc.moveDown();

    // Score
    doc.fontSize(18).text(`Deliverability Score: ${report.summary.deliverabilityScore}%`, {
      underline: true
    });
    doc.moveDown();

    // Summary
    doc.fontSize(14).text('Summary:', { underline: true });
    doc.fontSize(12);
    doc.text(`Total Inboxes: ${report.summary.totalInboxes}`);
    doc.text(`✓ Inbox: ${report.summary.inbox}`);
    doc.text(`⚠ Spam: ${report.summary.spam}`);
    doc.text(`📁 Promotions: ${report.summary.promotions}`);
    doc.text(`✗ Not Found: ${report.summary.notFound}`);
    doc.moveDown();

    // Details
    doc.fontSize(14).text('Details:', { underline: true });
    doc.fontSize(10);
    
    report.details.forEach((detail, index) => {
      doc.text(`${index + 1}. ${detail.provider} (${detail.email})`);
      doc.text(`   Folder: ${detail.folder}`);
      doc.text(`   Status: ${detail.status}`);
      if (detail.receivedAt) {
        doc.text(`   Received: ${new Date(detail.receivedAt).toLocaleString()}`);
      }
      doc.moveDown(0.5);
    });

    // Footer
    doc.fontSize(8).text(
      `Generated on ${new Date().toLocaleString()}`,
      50,
      doc.page.height - 50,
      { align: 'center' }
    );

    doc.end();
  } catch (error) {
    console.error('Error generating PDF:', error);
    
    if (error.message === 'Report not found') {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error generating PDF',
      error: error.message
    });
  }
};