# 🏗️ System Architecture

## High-Level Architecture

```mermaid
C4Context
    title System Context Diagram - Email Spam Report Tool

    Person(user, "User", "Tests email deliverability")
    
    System(webapp, "Email Spam Report Tool", "Web application for testing email deliverability")
    
    System_Ext(gmail, "Gmail", "Google email service")
    System_Ext(outlook, "Outlook", "Microsoft email service")
    System_Ext(yahoo, "Yahoo Mail", "Yahoo email service")
    System_Ext(smtp, "SMTP Server", "Email delivery")
    
    Rel(user, webapp, "Uses", "HTTPS")
    Rel(webapp, gmail, "Checks emails", "Gmail API")
    Rel(webapp, outlook, "Checks emails", "Graph API")
    Rel(webapp, yahoo, "Checks emails", "IMAP")
    Rel(webapp, smtp, "Sends reports", "SMTP")
```

## Component Architecture

```mermaid
C4Container
    title Container Diagram - Email Spam Report Tool

    Person(user, "User")
    
    Container(spa, "Single Page Application", "React", "Provides UI for email testing")
    Container(api, "API Application", "Express.js", "Handles business logic")
    Container(db, "Database", "MongoDB", "Stores tests and reports")
    
    Container_Ext(gmail_api, "Gmail API", "Google", "Email checking")
    Container_Ext(graph_api, "Microsoft Graph", "Microsoft", "Email checking")
    Container_Ext(imap, "IMAP", "Yahoo", "Email checking")
    
    Rel(user, spa, "Uses", "HTTPS")
    Rel(spa, api, "Makes API calls", "JSON/HTTPS")
    Rel(api, db, "Reads/Writes", "MongoDB Protocol")
    Rel(api, gmail_api, "Checks emails", "OAuth2/HTTPS")
    Rel(api, graph_api, "Checks emails", "OAuth2/HTTPS")
    Rel(api, imap, "Checks emails", "IMAP/TLS")
```

## Data Flow Architecture

```mermaid
flowchart TD
    A[User Browser] -->|1. Create Test| B[React Frontend]
    B -->|2. POST /api/tests| C[Express Router]
    C -->|3. Process Request| D[Test Controller]
    D -->|4. Generate Code| E[Utils]
    D -->|5. Save Test| F[MongoDB]
    F -->|6. Return Test| D
    D -->|7. Response| B
    B -->|8. Display Code| A
    
    A -->|9. Start Test| B
    B -->|10. POST /api/tests/:id/start| C
    C -->|11. Process| G[Detection Service]
    G -->|12. Async Check| H[Email Service]
    
    H -->|13. Check| I[Gmail API]
    H -->|14. Check| J[Graph API]
    H -->|15. Check| K[Yahoo IMAP]
    
    I -->|16. Results| H
    J -->|17. Results| H
    K -->|18. Results| H
    
    H -->|19. Update| F
    G -->|20. Generate| L[Report Service]
    L -->|21. Save Report| F
    L -->|22. Send Email| M[SMTP]
    L -->|23. Complete| F
    
    B -->|24. Poll Status| C
    C -->|25. Get Status| F
    F -->|26. Return| C
    C -->|27. Response| B
    B -->|28. Update UI| A
    
    style A fill:#e1f5ff
    style B fill:#61dafb
    style C fill:#68a063
    style F fill:#4db33d
```

## Folder Structure

```
email-spam-report-tool/
│
├── backend/                      # Node.js Backend
│   ├── config/                   # Configuration files
│   │   ├── database.js          # MongoDB connection
│   │   └── email.config.js      # Email service configs
│   │
│   ├── controllers/              # Request handlers
│   │   ├── test.controller.js   # Test CRUD operations
│   │   └── report.controller.js # Report operations
│   │
│   ├── models/                   # Mongoose schemas
│   │   ├── Test.model.js        # Test document schema
│   │   └── Report.model.js      # Report document schema
│   │
│   ├── routes/                   # API routes
│   │   ├── test.routes.js       # Test endpoints
│   │   └── report.routes.js     # Report endpoints
│   │
│   ├── services/                 # Business logic
│   │   ├── email.service.js     # Email operations
│   │   ├── detection.service.js # Email detection logic
│   │   └── report.service.js    # Report generation
│   │
│   ├── utils/                    # Helper functions
│   │   ├── generateTestCode.js  # Test code generator
│   │   └── emailTemplates.js    # Email HTML templates
│   │
│   ├── middleware/               # Express middleware
│   │   └── errorHandler.js      # Global error handler
│   │
│   ├── .env                      # Environment variables
│   ├── .gitignore               # Git ignore file
│   ├── package.json             # Dependencies
│   └── server.js                # Entry point
│
├── frontend/                     # React Frontend
│   ├── public/                   # Static files
│   │   ├── index.html           # HTML template
│   │   └── favicon.ico          # Favicon
│   │
│   ├── src/
│   │   ├── components/           # React components
│   │   │   ├── TestInboxes.jsx  # Display test inboxes
│   │   │   ├── TestCodeDisplay.jsx # Show test code
│   │   │   ├── TestProgress.jsx # Progress tracker
│   │   │   ├── Report.jsx       # Report display
│   │   │   ├── ReportHistory.jsx # Test history
│   │   │   ├── Loader.jsx       # Loading spinner
│   │   │   └── EmptyState.jsx   # Empty state UI
│   │   │
│   │   ├── pages/                # Page components
│   │   │   ├── Home.jsx         # Landing page
│   │   │   ├── TestPage.jsx     # Test execution page
│   │   │   └── ReportPage.jsx   # Report view page
│   │   │
│   │   ├── services/             # API services
│   │   │   └── api.js           # Axios HTTP client
│   │   │
│   │   ├── utils/                # Helper functions
│   │   │   └── helpers.js       # Utility functions
│   │   │
│   │   ├── styles/               # CSS files
│   │   │   ├── App.css          # Main styles
│   │   │   └── components.css   # Component styles
│   │   │
│   │   ├── App.jsx              # Main app component
│   │   ├── index.js             # Entry point
│   │   └── index.css            # Global styles
│   │
│   ├── .env                      # Environment variables
│   ├── .gitignore               # Git ignore file
│   └── package.json             # Dependencies
│
├── docs/                         # Documentation
│   ├── WORKFLOW.md              # This file
│   ├── ARCHITECTURE.md          # Architecture details
│   ├── API.md                   # API documentation
│   └── SETUP.md                 # Setup instructions
│
├── .gitignore                    # Root git ignore
├── README.md                     # Project overview
└── LICENSE                       # MIT License
```

---

**Continue reading:**
- [API Documentation](API.md)
- [Setup Guide](SETUP.md)
- [Main Workflow](WORKFLOW.md)