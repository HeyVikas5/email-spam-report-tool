# 📧 Email Spam Report Tool

A full-stack web application that tests email deliverability across multiple email providers (Gmail, Outlook, Yahoo). Users can check where their emails land - Inbox, Spam, or Promotions folder.

🔗 **Live Demo**: [Your Deployed URL]
📦 **GitHub Repo**: [Your Repository URL]

## 🎯 What It Does

This tool helps you:
- Test email deliverability across 5 different email providers
- Detect which folder your email lands in (Inbox, Spam, Promotions)
- Get a detailed deliverability score
- Receive shareable reports via email and hosted link
- Track test history for comparison

## ✨ Features

### Core Features
- ✅ 5 test inboxes (Gmail x2, Outlook x2, Yahoo x1)
- ✅ Unique test code generation
- ✅ Automatic email detection across folders
- ✅ Real-time progress tracking
- ✅ Comprehensive deliverability report
- ✅ Email report delivery
- ✅ Shareable hosted report links

### Bonus Features
- ✅ Deliverability score (percentage)
- ✅ Test history for comparison
- ✅ PDF export functionality
- ✅ Modern, responsive UI
- ✅ Loading and empty states

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB Atlas
- **Email Services**: 
  - Gmail API (googleapis)
  - Microsoft Graph API (@microsoft/microsoft-graph-client)
  - Yahoo IMAP (imap)
- **Email Sending**: Nodemailer
- **PDF Generation**: PDFKit

### Frontend
- **Framework**: React.js
- **Routing**: React Router
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

## 📁 Project Structure

```
email-spam-report-tool/
├── backend/
│   ├── config/          # Database and email configuration
│   ├── controllers/     # Request handlers
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── utils/           # Helper functions
│   ├── middleware/      # Error handling
│   └── server.js        # Entry point
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── services/    # API calls
│   │   ├── utils/       # Helper functions
│   │   └── styles/      # CSS files
│   └── public/          # Static files
└── README.md
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account
- Gmail API credentials
- Microsoft Azure App registration (for Outlook)
- Yahoo app password

### Backend Setup

1. **Clone the repository**
```bash
git clone https://github.com/HeyVikas5/email-spam-report-tool.git
cd email-spam-report-tool/backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
cp .env.example .env
```

Edit `.env` with your credentials:
```env
# MongoDB
MONGODB_URI=your_mongodb_uri

# Gmail (create 2 test accounts)
GMAIL_1_EMAIL=test1@gmail.com
GMAIL_1_CLIENT_ID=your_client_id
GMAIL_1_CLIENT_SECRET=your_client_secret
GMAIL_1_REFRESH_TOKEN=your_refresh_token

# Outlook (create 2 test accounts)
OUTLOOK_1_EMAIL=test1@outlook.com
OUTLOOK_1_CLIENT_ID=your_client_id
OUTLOOK_1_CLIENT_SECRET=your_client_secret
OUTLOOK_1_TENANT_ID=your_
