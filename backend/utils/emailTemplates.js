const getReportEmailTemplate = (testCode, reportUrl, summary) => {
  const scoreColor = summary.deliverabilityScore >= 80 ? '#10b981' : 
                     summary.deliverabilityScore >= 60 ? '#f59e0b' : '#ef4444';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Deliverability Report</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">📧 Deliverability Report Ready</h1>
            </td>
          </tr>
          
          <!-- Test Code -->
          <tr>
            <td style="padding: 30px 40px 20px;">
              <p style="margin: 0 0 10px; color: #6b7280; font-size: 14px;">Test Code</p>
              <p style="margin: 0; font-size: 24px; font-weight: 700; color: #111827; font-family: 'Courier New', monospace;">${testCode}</p>
            </td>
          </tr>
          
          <!-- Score -->
          <tr>
            <td style="padding: 20px 40px;">
              <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; text-align: center;">
                <p style="margin: 0 0 10px; color: #6b7280; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Deliverability Score</p>
                <p style="margin: 0; font-size: 48px; font-weight: 800; color: ${scoreColor};">${summary.deliverabilityScore}%</p>
              </div>
            </td>
          </tr>
          
          <!-- Results Summary -->
          <tr>
            <td style="padding: 20px 40px;">
              <h2 style="margin: 0 0 20px; font-size: 18px; color: #111827;">Results Summary</h2>
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 12px; background-color: #ecfdf5; border-radius: 6px; margin-bottom: 8px;">
                    <span style="color: #065f46; font-weight: 600;">✓ Inbox:</span>
                    <span style="color: #065f46; float: right; font-weight: 700;">${summary.inbox}/${summary.totalInboxes}</span>
                  </td>
                </tr>
                <tr><td style="height: 8px;"></td></tr>
                <tr>
                  <td style="padding: 12px; background-color: #fef3c7; border-radius: 6px;">
                    <span style="color: #92400e; font-weight: 600;">⚠ Spam:</span>
                    <span style="color: #92400e; float: right; font-weight: 700;">${summary.spam}/${summary.totalInboxes}</span>
                  </td>
                </tr>
                <tr><td style="height: 8px;"></td></tr>
                <tr>
                  <td style="padding: 12px; background-color: #dbeafe; border-radius: 6px;">
                    <span style="color: #1e40af; font-weight: 600;">📁 Promotions:</span>
                    <span style="color: #1e40af; float: right; font-weight: 700;">${summary.promotions}/${summary.totalInboxes}</span>
                  </td>
                </tr>
                <tr><td style="height: 8px;"></td></tr>
                <tr>
                  <td style="padding: 12px; background-color: #fee2e2; border-radius: 6px;">
                    <span style="color: #991b1b; font-weight: 600;">✗ Not Found:</span>
                    <span style="color: #991b1b; float: right; font-weight: 700;">${summary.notFound}/${summary.totalInboxes}</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- CTA Button -->
          <tr>
            <td style="padding: 30px 40px;">
              <a href="${reportUrl}" style="display: block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 8px; text-align: center; font-weight: 600; font-size: 16px;">View Full Report</a>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 20px 40px 40px; text-align: center; color: #6b7280; font-size: 12px;">
              <p style="margin: 0 0 10px;">This report will be available for 7 days.</p>
              <p style="margin: 0;">© ${new Date().getFullYear()} Email Spam Report Tool. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
};

module.exports = {
  getReportEmailTemplate
};