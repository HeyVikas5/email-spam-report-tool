# 📧 Email Spam Report Tool

A full-stack web application that tests email deliverability across multiple email providers (Gmail, Outlook, Yahoo). Users can check where their emails land - Inbox, Spam, or Promotions folder - and receive a detailed deliverability report.
  
📦 **GitHub Repository**: [https://github.com/HeyVikas5/email-spam-report-tool](https://github.com/HeyVikas5/email-spam-report-tool)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Demo Screenshots](#-demo-screenshots)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Running the Application](#-running-the-application)
- [API Documentation](#-api-documentation)
- [Workflow Visualization](#-workflow-visualization)
- [Deployment](#-deployment)
- [Contact](#-contact)

---

## 🎯 Overview

The **Email Spam Report Tool** helps users understand email deliverability by testing how emails are received across different email providers. This is crucial for:

- **Marketers** testing email campaign deliverability
- **Developers** debugging email delivery issues
- **Business owners** ensuring important emails reach customers' inboxes
- **Email service providers** monitoring deliverability rates

### How It Works

1. **Get Test Code** - Create a new test and receive a unique test code
2. **Send Email** - Send an email from your account to 5 test inboxes with the test code
3. **Auto Detection** - System automatically checks where your email landed (Inbox/Spam/Promotions)
4. **Get Report** - Receive a comprehensive deliverability report with a score

⏱️ **Total Time**: ~3-5 minutes from start to report

---

## ✨ Features

### Core Features ✅

- **5 Test Inboxes** - Gmail (×2), Outlook (×2), Yahoo (×1)
- **Unique Test Code Generation** - 8-character alphanumeric code for each test
- **Automatic Email Detection** - Checks Inbox, Spam, and Promotions folders
- **Real-time Progress Tracking** - Live updates every 10 seconds during detection
- **Comprehensive Reports** - Detailed breakdown of where emails landed
- **Email Report Delivery** - Beautiful HTML email with results sent to user
- **Shareable Report Links** - Hosted report URLs valid for 7 days

### Bonus Features 🎁

- **Deliverability Score** - Percentage based on inbox delivery rate (e.g., 4/5 = 80%)
- **Test History** - View and compare past test results
- **PDF Export** - Download reports as PDF for record-keeping
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **Loading States** - Professional loading, empty, and success states
- **Error Handling** - Graceful error handling with user-friendly messages

---

## 📸 Demo Screenshots

### Homepage
```
┌─────────────────────────────────────────────┐
│  📧 Email Spam Report Tool                  │
│  Test your email deliverability             │
│  ────────────────────────────────────       │
│                                             │
│  Test Inboxes (5)                           │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌───┐ │
│  │Gmail │ │Gmail │ │Outlook│ │Outlook│ │Yah││
│  │  #1  │ │  #2  │ │  #1  │ │  #2  │ │oo ││
│  └──────┘ └──────┘ └──────┘ └──────┘ └───┘ │
│                                             │
│  Your Email: [user@example.com     ]        │
│                                             │
│  [      📤 Start New Test      ]            │
│                                             │
│  Recent Tests: TEST-A1B2C3D4 (85%) ⟩       │
└─────────────────────────────────────────────┘
```

### Test Page (Processing)
```
┌─────────────────────────────────────────────┐
│  Test Code: TEST-A1B2C3D4                   │
│  ────────────────────────────────────       │
│  Detection Progress        60% Complete     │
│  ▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░                       │
│                                             │
│  [G] Gmail #1          ✅ Inbox             │
│  [G] Gmail #2          ⚠️  Spam             │
│  [O] Outlook #1        ⏳ Checking...       │
│  [O] Outlook #2        ⏳ Checking...       │
│  [Y] Yahoo             ⏳ Pending           │
└─────────────────────────────────────────────┘
```

### Report Page
```
┌─────────────────────────────────────────────┐
│  📊 Deliverability Report                   │
│  ────────────────────────────────────       │
│                                             │
│  ╔═══════════════════════════════════════╗ │
│  ║   Deliverability Score: 80%           ║ │
│  ║   4/5 emails delivered to inbox       ║ │
│  ╚═══════════════════════════════════════╝ │
│                                             │
│  ✅ Inbox: 4/5  ⚠️ Spam: 1/5               │
│  📁 Promotions: 0/5  ❌ Not Found: 0/5     │
│                                             │
│  [📥 Download PDF] [🔗 Share] [🔄 New]    │
└─────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

### Frontend
- **React.js** 18.2.0 - UI library
- **React Router** 6.18.0 - Client-side routing
- **Axios** 1.5.1 - HTTP client
- **Lucide React** 0.292.0 - Icon library
- **React Hot Toast** 2.4.1 - Notifications

### Backend
- **Node.js** - Runtime environment
- **Express.js** 4.18.2 - Web framework
- **MongoDB Atlas** - Cloud database (Mongoose 7.6.3)
- **Nodemailer** 6.9.7 - Email sending
- **PDFKit** 0.13.0 - PDF generation

### Email Services Integration
- **Gmail API** (googleapis 128.0.0) - Gmail inbox checking
- **Microsoft Graph API** (@microsoft/microsoft-graph-client 3.0.7) - Outlook inbox checking
- **Yahoo IMAP** (imap 0.8.19) - Yahoo inbox checking

### Development Tools
- **Nodemon** 3.0.1 - Development server
- **dotenv** 16.3.1 - Environment variables
- **CORS** 2.8.5 - Cross-origin resource sharing

---

## 📁 Project Structure

```
email-spam-report-tool/
│
├── backend/                      # Node.js Backend
│   ├── config/
│   │   ├── database.js          # MongoDB connection
│   │   └── email.config.js      # Email service configurations
│   │
│   ├── controllers/
│   │   ├── test.controller.js   # Test CRUD operations
│   │   └── report.controller.js # Report operations
│   │
│   ├── models/
│   │   ├── Test.model.js        # Test schema
│   │   └── Report.model.js      # Report schema
│   │
│   ├── routes/
│   │   ├── test.routes.js       # Test endpoints
│   │   └── report.routes.js     # Report endpoints
│   │
│   ├── services/
│   │   ├── email.service.js     # Email operations
│   │   ├── detection.service.js # Email detection logic
│   │   └── report.service.js    # Report generation
│   │
│   ├── utils/
│   │   ├── generateTestCode.js  # Test code generator
│   │   └── emailTemplates.js    # Email HTML templates
│   │
│   ├── middleware/
│   │   └── errorHandler.js      # Error handling
│   │
│   ├── .env.example             # Environment variables template
│   ├── .gitignore
│   ├── package.json
│   └── server.js                # Entry point
│
├── frontend/                     # React Frontend
│   ├── public/
│   │   ├── index.html
│   │   └── favicon.ico
│   │
│   ├── src/
│   │   ├── components/
│   │   │   ├── TestInboxes.jsx
│   │   │   ├── TestCodeDisplay.jsx
│   │   │   ├── TestProgress.jsx
│   │   │   ├── Report.jsx
│   │   │   ├── ReportHistory.jsx
│   │   │   ├── Loader.jsx
│   │   │   └── EmptyState.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── TestPage.jsx
│   │   │   └── ReportPage.jsx
│   │   │
│   │   ├── services/
│   │   │   └── api.js           # API calls
│   │   │
│   │   ├── utils/
│   │   │   └── helpers.js       # Utility functions
│   │   │
│   │   ├── styles/
│   │   │   ├── App.css
│   │   │   └── components.css
│   │   │
│   │   ├── App.jsx
│   │   ├── index.js
│   │   └── index.css
│   │
│   ├── .env.example
│   ├── .gitignore
│   └── package.json
│
├── docs/
│   ├── WORKFLOW.md              # Visual workflow guide
│   ├── ARCHITECTURE.md          # Architecture details
│   ├── API.md                   # API documentation
│   └── SETUP.md                 # Detailed setup guide
│
├── .gitignore
├── README.md                     # This file
└── LICENSE                       # MIT License
```

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** - Comes with Node.js
- **MongoDB Atlas Account** - [Sign up](https://www.mongodb.com/cloud/atlas)
- **Git** - [Download](https://git-scm.com/)

You'll also need accounts and API credentials for:
- **Gmail API** (Google Cloud Console)
- **Microsoft Graph API** (Azure Portal)
- **Yahoo Mail** (App-specific password)

---


---

## 🏃 Running the Application

### Development Mode

#### 1. Start Backend Server

```bash
cd backend
npm run dev
```

Backend will run on `http://localhost:5000`

#### 2. Start Frontend Development Server

Open a new terminal:

```bash
cd frontend
npm start
```

Frontend will run on `http://localhost:3000`

#### 3. Open Browser

Navigate to `http://localhost:3000`

### Production Mode

#### Backend

```bash
cd backend
npm start
```

#### Frontend

```bash
cd frontend
npm run build
# Serve the build folder with a static server like serve or deploy to hosting
npx serve -s build
```

---

## 📡 API Documentation

### Base URL

```
Development: http://localhost:5000/api
Production: https://your-api-url.com/api
```

### Main Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/tests/inboxes` | Get list of test inboxes |
| POST | `/tests` | Create new test |
| POST | `/tests/:testId/start` | Start detection process |
| GET | `/tests/:testId/status` | Get test status (polling) |
| GET | `/tests/code/:testCode` | Get test by code |
| GET | `/reports/:testCode` | Get report by test code |
| GET | `/reports/history/user` | Get user's test history |
| GET | `/reports/:testCode/pdf` | Download report as PDF |

**Full API Documentation**: See [docs/API.md](docs/API.md)

---

## 🎨 Workflow Visualization

### Quick Overview

```
1. User enters email → Creates test → Gets unique code
                              ↓
2. User sends email to 5 inboxes with test code
                              ↓
3. System checks inboxes every 30s (max 5 minutes)
                              ↓
4. Generates report with deliverability score
                              ↓
5. Sends email report and displays results
```

### Detailed Workflow

For complete visual workflows, architecture diagrams, and step-by-step flows, see:

- **[Complete Workflow Guide](docs/WORKFLOW.md)** - Visual step-by-step process
- **[System Architecture](docs/ARCHITECTURE.md)** - Technical architecture details
- **[API Documentation](docs/API.md)** - Complete API reference
- **[Setup Guide](docs/SETUP.md)** - Detailed setup instructions



---

#### Database

MongoDB Atlas is already cloud-hosted. Update `MONGODB_URI` in your deployment environment variables.

### Environment Variables for Production

Ensure these are set in your deployment platform:

**Backend**:
- `NODE_ENV=production`
- `PORT=5000` (or assigned by platform)
- `MONGODB_URI`
- `FRONTEND_URL` (your deployed frontend URL)
- All Gmail, Outlook, Yahoo credentials
- SMTP credentials

**Frontend**:
- `REACT_APP_API_URL` (your deployed backend URL)

### Post-Deployment Checklist

- [ ] Backend health check: `https://your-api.com/api/health`
- [ ] Frontend loads correctly
- [ ] CORS configured for frontend domain
- [ ] All environment variables set
- [ ] MongoDB connection working
- [ ] Email services authenticated
- [ ] Test creating a new test
- [ ] Test detection process
- [ ] Verify report generation
- [ ] Check email notifications

---


## 📞 Contact

**Vikas** - [@HeyVikas5](https://github.com/HeyVikas5)




### Built With

- [Express.js](https://expressjs.com/) - Fast, unopinionated web framework
- [React](https://reactjs.org/) - A JavaScript library for building user interfaces
- [MongoDB](https://www.mongodb.com/) - Document database
- [Nodemailer](https://nodemailer.com/) - Email sending library
- [PDFKit](https://pdfkit.org/) - PDF generation library

---




## 💡 Use Cases

### For Marketers
- Test campaign deliverability before sending to entire list
- Identify spam triggers in email content
- Compare subject lines and sender addresses
- Monitor deliverability trends over time

### For Developers
- Debug email delivery issues
- Test transactional emails (receipts, password resets)
- Verify SPF, DKIM, DMARC configurations
- Ensure notifications reach users

### For Businesses
- Ensure important announcements reach customers
- Test email newsletter deliverability
- Verify invoice and order confirmation emails
- Monitor email infrastructure health

### For Email Service Providers
- Quality assurance for email delivery
- Customer deliverability reporting
- Identify problematic domains or content
- Benchmark against competitors

---

## 🎓 Learning Resources

### Understanding Email Deliverability

- [Gmail Postmaster Tools](https://postmaster.google.com/)
- [Microsoft SNDS](https://sendersupport.olc.protection.outlook.com/snds/)
- [Email Deliverability Guide](https://sendgrid.com/blog/email-deliverability-guide/)
- [SPF, DKIM, DMARC Explained](https://www.cloudflare.com/learning/email-security/dmarc-dkim-spf/)

### Technologies Used

- [React Documentation](https://react.dev/)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [MongoDB University](https://university.mongodb.com/)
- [Gmail API Docs](https://developers.google.com/gmail/api)
- [Microsoft Graph Docs](https://docs.microsoft.com/en-us/graph/)

---






## 🧪 Testing

### Running Tests

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test

# Coverage report
npm run test:coverage
```

### Test Structure

```
backend/
  └── tests/
      ├── unit/
      │   ├── controllers/
      │   ├── services/
      │   └── utils/
      └── integration/
          └── api/

frontend/
  └── src/
      └── __tests__/
          ├── components/
          └── pages/
```

### Manual Testing Checklist

- [ ] Create new test
- [ ] Copy test code
- [ ] Send email with test code
- [ ] Start detection
- [ ] Monitor progress
- [ ] View completed report
- [ ] Download PDF
- [ ] Share report link
- [ ] View test history

---

## 📦 Dependencies

### Backend Dependencies

```json
{
  "express": "^4.18.2",
  "mongoose": "^7.6.3",
  "dotenv": "^16.3.1",
  "cors": "^2.8.5",
  "nodemailer": "^6.9.7",
  "googleapis": "^128.0.0",
  "@microsoft/microsoft-graph-client": "^3.0.7",
  "@azure/identity": "^4.0.0",
  "imap": "^0.8.19",
  "mailparser": "^3.6.5",
  "uuid": "^9.0.1",
  "pdfkit": "^0.13.0"
}
```

### Frontend Dependencies

```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.18.0",
  "axios": "^1.5.1",
  "react-hot-toast": "^2.4.1",
  "lucide-react": "^0.292.0"
}
```

---







## 💖 Support the Project

If you find this project helpful:

- ⭐ **Star this repository** on GitHub
- 🐛 **Report bugs** and suggest features
- 📝 **Improve documentation**
- 🤝 **Contribute code**
- 📢 **Share with others**
- 

---

<div align="center">

**Built with ❤️ by [HeyVikas5](https://github.com/HeyVikas5)**

[⬆ Back to Top](#-email-spam-report-tool)


</div>
