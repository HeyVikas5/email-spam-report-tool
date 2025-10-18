# 📧 Email Spam Report Tool - Complete Workflow

> **Visual guide to understand how the application works from start to finish**

## 📑 Table of Contents
- [Quick Overview](#quick-overview)
- [Detailed Step-by-Step Flow](#detailed-step-by-step-flow)
- [Architecture Diagram](#architecture-diagram)
- [API Flow](#api-flow)
- [Timeline](#timeline)
- [UI States](#ui-states)

---

## 🎯 Quick Overview

```mermaid
graph LR
    A[User Visits Homepage] --> B[Enter Email & Start Test]
    B --> C[Get Test Code]
    C --> D[Send Email to 5 Inboxes]
    D --> E[Start Detection]
    E --> F[Check Each Inbox]
    F --> G[Generate Report]
    G --> H[View Results]
    
    style A fill:#e1f5ff
    style D fill:#fff4e1
    style F fill:#ffe1e1
    style H fill:#e1ffe1
```

---

## 🔄 Detailed Step-by-Step Flow

### Step 1: Homepage - Start New Test

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    participant MongoDB

    User->>Frontend: Visits homepage
    Frontend->>Backend: GET /api/tests/inboxes
    Backend-->>Frontend: Returns 5 test email addresses
    Frontend-->>User: Displays test inboxes
    
    User->>Frontend: Enters email & clicks "Start Test"
    Frontend->>Backend: POST /api/tests {userEmail}
    Backend->>Backend: Generate unique test code
    Backend->>MongoDB: Save test document
    MongoDB-->>Backend: Confirmation
    Backend-->>Frontend: Returns testId & testCode
    Frontend-->>User: Redirect to /test/{testId}
```

**Screenshot Preview:**
```
┌─────────────────────────────────────────────┐
│  📧 Email Spam Report Tool                  │
│  ────────────────────────────────────       │
│                                             │
│  Test Inboxes:                              │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌───┐ │
│  │Gmail1│ │Gmail2│ │Outlook│ │Outlook│ │Yho││
│  └──────┘ └──────┘ └──────┘ └──────┘ └───┘ │
│                                             │
│  Your Email: [___________________]          │
│                                             │
│  [      Start New Test      ]               │
└─────────────────────────────────────────────┘
```

---

### Step 2: Test Page - Display Test Code

```mermaid
graph TD
    A[Test Created] --> B[Display Test Code]
    B --> C[Show Instructions]
    C --> D{User Action}
    D -->|Copy Code| E[Clipboard]
    D -->|Send Email| F[External Email Client]
    F --> G[Click 'I've Sent Email']
    G --> H[Start Detection Process]
    
    style A fill:#e1f5ff
    style B fill:#fff4e1
    style H fill:#e1ffe1
```

**Screenshot Preview:**
```
┌─────────────────────────────────────────────┐
│  📧 Email Deliverability Test               │
│  Test Code: TEST-A1B2C3D4                   │
│  ────────────────────────────────────       │
│                                             │
│  ╔═══════════════════════════════════════╗ │
│  ║     Your Test Code                    ║ │
│  ║                                       ║ │
│  ║        TEST-A1B2C3D4                  ║ │
│  ║                                       ║ │
│  ║        [📋 Copy Code]                 ║ │
│  ╚═══════════════════════════════════════╝ │
│                                             │
│  Instructions:                              │
│  1. Send email to all 5 test inboxes       │
│  2. Include TEST-A1B2C3D4 in subject/body  │
│  3. Click button below                      │
│                                             │
│  [     ✅ I've Sent the Email     ]         │
└─────────────────────────────────────────────┘
```

---

### Step 3: Email Detection Process

```mermaid
graph TB
    Start[User Clicks 'I've Sent Email'] --> UpdateStatus[Update Status: Processing]
    UpdateStatus --> StartDetection[Start Async Detection]
    StartDetection --> Parallel{Check All 5 Inboxes}
    
    Parallel -->|Gmail API| Gmail1[Check Gmail #1]
    Parallel -->|Gmail API| Gmail2[Check Gmail #2]
    Parallel -->|Graph API| Outlook1[Check Outlook #1]
    Parallel -->|Graph API| Outlook2[Check Outlook #2]
    Parallel -->|IMAP| Yahoo[Check Yahoo]
    
    Gmail1 --> Detect1{Email Found?}
    Gmail2 --> Detect2{Email Found?}
    Outlook1 --> Detect3{Email Found?}
    Outlook2 --> Detect4{Email Found?}
    Yahoo --> Detect5{Email Found?}
    
    Detect1 -->|Yes| Folder1[Detect Folder]
    Detect1 -->|No| Retry1[Retry in 30s]
    Retry1 --> Detect1
    
    Detect2 -->|Yes| Folder2[Detect Folder]
    Detect3 -->|Yes| Folder3[Detect Folder]
    Detect4 -->|Yes| Folder4[Detect Folder]
    Detect5 -->|Yes| Folder5[Detect Folder]
    
    Folder1 --> Complete{All Checked?}
    Folder2 --> Complete
    Folder3 --> Complete
    Folder4 --> Complete
    Folder5 --> Complete
    
    Complete -->|Yes| GenerateReport[Generate Report]
    Complete -->|No| Parallel
    
    GenerateReport --> SendEmail[Send Email to User]
    SendEmail --> Done[Redirect to Report]
    
    style Start fill:#e1f5ff
    style Parallel fill:#fff4e1
    style Complete fill:#ffe1e1
    style Done fill:#e1ffe1
```

**Detection Logic:**
```
┌────────────────────────────────────────────────────┐
│  Detection Service                                 │
│  ─────────────────────────────────────────         │
│                                                    │
│  FOR EACH INBOX:                                   │
│    ┌──────────────────────────────────────┐       │
│    │ 1. Connect to email service          │       │
│    │ 2. Search for test code               │       │
│    │ 3. Check folder location              │       │
│    │ 4. Update database                    │       │
│    └──────────────────────────────────────┘       │
│                                                    │
│  Retry Logic:                                      │
│    • Check every 30 seconds                        │
│    • Maximum 10 attempts (5 minutes total)         │
│    • Stop when email found or max retries reached  │
│                                                    │
│  Provider-Specific:                                │
│    📧 Gmail     → OAuth2 + Gmail API               │
│    📨 Outlook   → OAuth2 + Microsoft Graph API     │
│    📬 Yahoo     → App Password + IMAP              │
└────────────────────────────────────────────────────┘
```

---

### Step 4: Progress Tracking

```mermaid
gantt
    title Email Detection Timeline (3-5 minutes)
    dateFormat mm:ss
    section Detection
    Start Detection      :00:00, 00:30
    Check Attempt 1      :00:30, 00:30
    Check Attempt 2      :01:00, 00:30
    Check Attempt 3      :01:30, 00:30
    Check Attempt 4      :02:00, 00:30
    Check Attempt 5      :02:30, 00:30
    All Emails Found     :03:00, 00:30
    Generate Report      :03:30, 00:30
    Complete             :04:00, 00:30
```

**Screenshot Preview:**
```
┌─────────────────────────────────────────────┐
│  Detection Progress        60% Complete     │
│  ────────────────────────────────────       │
│  ▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░                       │
│                                             │
│  ┌───────────────────────────────────────┐ │
│  │ [G] Gmail #1          ✅ Inbox        │ │
│  │     test1@gmail.com                   │ │
│  ├───────────────────────────────────────┤ │
│  │ [G] Gmail #2          ⚠️  Spam        │ │
│  │     test2@gmail.com                   │ │
│  ├───────────────────────────────────────┤ │
│  │ [O] Outlook #1        ⏳ Checking...  │ │
│  │     test1@outlook.com                 │ │
│  ├───────────────────────────────────────┤ │
│  │ [O] Outlook #2        ⏳ Checking...  │ │
│  │     test2@outlook.com                 │ │
│  ├───────────────────────────────────────┤ │
│  │ [Y] Yahoo             ⏳ Pending      │ │
│  │     test@yahoo.com                    │ │
│  └───────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
```

---

### Step 5: Report Generation & Display

```mermaid
graph LR
    A[All Inboxes Checked] --> B[Calculate Score]
    B --> C[Create Report Document]
    C --> D[Generate Report URL]
    D --> E[Send Email to User]
    E --> F[Redirect to Report Page]
    
    B --> B1[Count Inbox: 2/5]
    B --> B2[Count Spam: 2/5]
    B --> B3[Count Promotions: 1/5]
    B --> B4[Score: 40%]
    
    style A fill:#e1f5ff
    style B fill:#fff4e1
    style C fill:#ffe1e1
    style F fill:#e1ffe1
```

**Screenshot Preview:**
```
┌─────────────────────────────────────────────┐
│  📊 Email Deliverability Report             │
│  ────────────────────────────────────       │
│                                             │
│  Test Code: TEST-A1B2C3D4                   │
│  Generated: Oct 16, 2025 at 6:23 PM        │
│                                             │
│  ╔═══════════════════════════════════════╗ │
│  ║   Deliverability Score                ║ │
│  ║                                       ║ │
│  ║            40%                        ║ │
│  ║                                       ║ │
│  ║   2/5 emails delivered to inbox       ║ │
│  ╚═══════════════════════════════════════╝ │
│                                             │
│  Summary:                                   │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌─────┐ │
│  │✅ Inbox│ │⚠️ Spam │ │📁 Promo│ │❌ N/F│ │
│  │  2/5   │ │  2/5   │ │  1/5   │ │ 0/5 │ │
│  └────────┘ └────────┘ └────────┘ └─────┘ │
│                                             │
│  Detailed Results:                          │
│  ┌───────────────────────────────────────┐ │
│  │ Gmail #1    → ✅ Inbox    → 6:20 PM  │ │
│  │ Gmail #2    → ⚠️  Spam    → 6:20 PM  │ │
│  │ Outlook #1  → ✅ Inbox    → 6:21 PM  │ │
│  │ Outlook #2  → 📁 Promo    → 6:21 PM  │ │
│  │ Yahoo       → ⚠️  Spam    → 6:21 PM  │ │
│  └───────────────────────────────────────┘ │
│                                             │
│  [📥 Download PDF] [🔗 Share] [🔄 New]    │
└─────────────────────────────────────────────┘
```

---

## 🏗️ Architecture Diagram

```mermaid
graph TB
    subgraph "Client Side"
        A[React Frontend]
        A1[Components]
        A2[Pages]
        A3[Services]
        A --> A1
        A --> A2
        A --> A3
    end
    
    subgraph "Server Side"
        B[Express Backend]
        B1[Controllers]
        B2[Services]
        B3[Routes]
        B --> B1
        B --> B2
        B --> B3
    end
    
    subgraph "Database"
        C[(MongoDB Atlas)]
        C1[Tests Collection]
        C2[Reports Collection]
        C --> C1
        C --> C2
    end
    
    subgraph "Email Services"
        D1[Gmail API]
        D2[Microsoft Graph]
        D3[Yahoo IMAP]
    end
    
    subgraph "Test Inboxes"
        E1[📧 Gmail #1]
        E2[📧 Gmail #2]
        E3[📨 Outlook #1]
        E4[📨 Outlook #2]
        E5[📬 Yahoo]
    end
    
    A <-->|HTTP/REST| B
    B <-->|Mongoose| C
    B -->|OAuth2| D1
    B -->|OAuth2| D2
    B -->|IMAP| D3
    D1 <-->|API Calls| E1
    D1 <-->|API Calls| E2
    D2 <-->|API Calls| E3
    D2 <-->|API Calls| E4
    D3 <-->|IMAP| E5
    
    style A fill:#61dafb
    style B fill:#68a063
    style C fill:#4db33d
    style D1 fill:#ea4335
    style D2 fill:#0078d4
    style D3 fill:#6001d2
```

---

## 🔌 API Flow

### API Endpoints Overview

```mermaid
graph LR
    A[Frontend] -->|1| B[GET /api/tests/inboxes]
    A -->|2| C[POST /api/tests]
    A -->|3| D[POST /api/tests/:id/start]
    A -->|4| E[GET /api/tests/:id/status]
    A -->|5| F[GET /api/reports/:code]
    A -->|6| G[GET /api/reports/:code/pdf]
    
    B --> H[Returns test inboxes]
    C --> I[Creates test & returns code]
    D --> J[Starts detection]
    E --> K[Returns live status]
    F --> L[Returns report data]
    G --> M[Downloads PDF]
    
    style A fill:#61dafb
    style C fill:#68a063
    style D fill:#ffa500
    style F fill:#4db33d
```

### Complete API Request/Response Flow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant B as Backend
    participant D as Detection Service
    participant ES as Email Services
    participant DB as MongoDB
    participant Mail as Email Server

    Note over U,Mail: Step 1: Create Test
    U->>F: Enter email & click "Start Test"
    F->>B: POST /api/tests {userEmail}
    B->>B: Generate TEST-XXXXXXXX
    B->>DB: Create Test document
    DB-->>B: Test created
    B-->>F: {testId, testCode, inboxes}
    F-->>U: Show test code page

    Note over U,Mail: Step 2: Start Detection
    U->>F: Click "I've Sent Email"
    F->>B: POST /api/tests/:id/start
    B->>DB: Update status: "processing"
    B->>D: Start detection async
    D->>D: Check every 30s, max 10 times
    B-->>F: {status: "processing"}
    F-->>U: Show progress

    Note over U,Mail: Step 3: Check Inboxes
    loop Every 30 seconds
        D->>ES: Check Gmail via API
        ES-->>D: Email found in Spam
        D->>DB: Update inbox status
        D->>ES: Check Outlook via Graph
        ES-->>D: Email found in Inbox
        D->>DB: Update inbox status
        D->>ES: Check Yahoo via IMAP
        ES-->>D: Email found in Spam
        D->>DB: Update inbox status
    end

    Note over U,Mail: Step 4: Polling for Updates
    loop Every 10 seconds
        F->>B: GET /api/tests/:id/status
        B->>DB: Fetch test status
        DB-->>B: Current status
        B-->>F: {status, inboxes}
        F-->>U: Update progress UI
    end

    Note over U,Mail: Step 5: Generate Report
    D->>D: All inboxes checked
    D->>B: Calculate score
    B->>DB: Create Report document
    DB-->>B: Report created
    B->>Mail: Send report email
    Mail-->>U: Email delivered
    B->>DB: Update test: "completed"
    B-->>F: Auto-redirect
    F-->>U: Show report page

    Note over U,Mail: Step 6: View Report
    F->>B: GET /api/reports/:code
    B->>DB: Fetch report
    DB-->>B: Report data
    B-->>F: {summary, details, score}
    F-->>U: Display report

    Note over U,Mail: Step 7: Download PDF (Optional)
    U->>F: Click "Download PDF"
    F->>B: GET /api/reports/:code/pdf
    B->>B: Generate PDF with PDFKit
    B-->>F: PDF file stream
    F-->>U: Download PDF
```

---

## ⏱️ Timeline

### Complete User Journey (0 - 5 minutes)

```mermaid
timeline
    title Email Spam Report Tool - User Journey Timeline
    00:00 : User visits homepage
          : Views 5 test inboxes
          : Enters email address
    00:10 : Clicks "Start New Test"
          : Test code generated
          : Redirected to test page
    00:20 : Sees test code: TEST-A1B2C3D4
          : Copies test code
          : Opens email client
    01:00 : Composes email
          : Adds test code to subject
          : Sends to all 5 inboxes
    01:30 : Returns to test page
          : Clicks "I've Sent Email"
          : Detection starts
    02:00 : Progress bar appears
          : First inbox checked
          : Gmail #1: Found in Inbox ✅
    02:30 : Second inbox checked
          : Gmail #2: Found in Spam ⚠️
    03:00 : Third inbox checked
          : Outlook #1: Found in Inbox ✅
    03:30 : Fourth inbox checked
          : Outlook #2: Found in Promotions 📁
    04:00 : Fifth inbox checked
          : Yahoo: Found in Spam ⚠️
    04:30 : All inboxes checked
          : Report generated
          : Score calculated: 40%
    05:00 : Email sent to user
          : Auto-redirect to report
          : User views full report
```

---

## 🎨 UI States

### State Machine Diagram

```mermaid
stateDiagram-v2
    [*] --> Homepage
    Homepage --> TestCreated: Click "Start Test"
    TestCreated --> TestPending: Show Test Code
    TestPending --> TestProcessing: Click "I've Sent Email"
    TestProcessing --> Checking1: Check Inbox 1
    Checking1 --> Checking2: Found/Retry
    Checking2 --> Checking3: Found/Retry
    Checking3 --> Checking4: Found/Retry
    Checking4 --> Checking5: Found/Retry
    Checking5 --> AllChecked: All Done
    AllChecked --> ReportGenerated: Calculate Score
    ReportGenerated --> TestCompleted: Save Report
    TestCompleted --> ReportPage: Auto Redirect
    ReportPage --> [*]: User Exits
    
    TestProcessing --> TestFailed: Error/Timeout
    TestFailed --> Homepage: Retry
```

### All UI States

```
┌────────────────────────────────────────────────────┐
│  1. LOADING STATE                                  │
│  ────────────────────────────────────              │
│       ⏳                                            │
│    Loading...                                      │
└────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────┐
│  2. EMPTY STATE                                    │
│  ────────────────────────────────────              │
│       📭                                            │
│  No tests yet                                      │
│  Start your first test!                            │
└────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────┐
│  3. PENDING STATE                                  │
│  ────────────────────────────────────              │
│  Test Code: TEST-A1B2C3D4                          │
│  ⏳ Waiting for you to send email...               │
│  [✅ I've Sent the Email]                          │
└────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────┐
│  4. PROCESSING STATE                               │
│  ────────────────────────────────────              │
│  🔍 Checking inboxes...                            │
│  ▓▓▓▓▓▓░░░░ 60%                                    │
│  This may take a few minutes                       │
└────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────┐
│  5. CHECKING STATE (Individual Inbox)              │
│  ────────────────────────────────────              │
│  [G] Gmail #1                                      │
│      test1@gmail.com                               │
│      ⏳ Checking... (Attempt 3/10)                 │
└────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────┐
│  6. DETECTED STATE (Individual Inbox)              │
│  ────────────────────────────────────              │
│  [G] Gmail #1                                      │
│      test1@gmail.com                               │
│      ✅ Inbox - Received at 6:20 PM                │
└────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────┐
│  7. COMPLETED STATE                                │
│  ────────────────────────────────────              │
│       ✅                                            │
│  Test Completed!                                   │
│  Score: 40%                                        │
│  Redirecting to report...                          │
└────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────┐
│  8. ERROR STATE                                    │
│  ────────────────────────────────────              │
│       ❌                                            │
│  Test Failed                                       │
│  Something went wrong                              │
│  [Try Again]                                       │
└────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────┐
│  9. NOT FOUND STATE (Individual Inbox)             │
│  ────────────────────────────────────              │
│  [Y] Yahoo                                         │
│      test@yahoo.com                                │
│      ❌ Not Found - Email not detected             │
└────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────┐
│  10. REPORT VIEW STATE                             │
│  ────────────────────────────────────              │
│  📊 Deliverability Score: 40%                      │
│  ✅ Inbox: 2/5  ⚠️ Spam: 2/5                       │
│  📁 Promotions: 1/5  ❌ Not Found: 0/5             │
│  [Download PDF] [Share] [New Test]                 │
└────────────────────────────────────────────────────┘
```

---

## 📊 Data Models

### Database Schema

```mermaid
erDiagram
    TEST ||--o{ INBOX : contains
    TEST ||--|| REPORT : generates
    
    TEST {
        ObjectId _id
        string testCode
        string userEmail
        string status
        number deliverabilityScore
        string reportUrl
        date completedAt
        date createdAt
        date expiresAt
    }
    
    INBOX {
        number inboxId
        string email
        string provider
        string status
        string folder
        date receivedAt
        number checkCount
        date lastCheckedAt
    }
    
    REPORT {
        ObjectId _id
        ObjectId testId
        string testCode
        string userEmail
        object summary
        array details
        string reportUrl
        boolean emailSent
        date createdAt
    }
```

---

## 🔐 Authentication Flow (Email Services)

### Gmail OAuth2 Flow

```mermaid
sequenceDiagram
    participant App as Our App
    participant Google as Google OAuth
    participant Gmail as Gmail API
    participant Inbox as Gmail Inbox

    Note over App,Inbox: One-time Setup (Done by Developer)
    App->>Google: Request OAuth credentials
    Google-->>App: Client ID + Secret
    App->>Google: Request access token
    Google-->>App: Refresh Token

    Note over App,Inbox: Runtime (Checking Emails)
    App->>Google: Exchange refresh token
    Google-->>App: Access token
    App->>Gmail: Search emails with access token
    Gmail->>Inbox: Query for test code
    Inbox-->>Gmail: Email data
    Gmail-->>App: Email found in Inbox/Spam/Promotions
```

### Outlook OAuth2 Flow

```mermaid
sequenceDiagram
    participant App as Our App
    participant Azure as Azure AD
    participant Graph as Microsoft Graph
    participant Inbox as Outlook Inbox

    Note over App,Inbox: One-time Setup
    App->>Azure: Register app
    Azure-->>App: Client ID + Secret + Tenant ID
    App->>Azure: Request permissions
    Azure-->>App: Grant access

    Note over App,Inbox: Runtime
    App->>Azure: Request access token
    Azure-->>App: Access token
    App->>Graph: Search emails with access token
    Graph->>Inbox: Query for test code
    Inbox-->>Graph: Email data
    Graph-->>App: Email found + Folder info
```

### Yahoo IMAP Flow

```mermaid
sequenceDiagram
    participant App as Our App
    participant Yahoo as Yahoo Mail
    participant IMAP as IMAP Server
    participant Inbox as Yahoo Inbox

    Note over App,Inbox: One-time Setup
    App->>Yahoo: Generate app password
    Yahoo-->>App: App-specific password

    Note over App,Inbox: Runtime
    App->>IMAP: Connect with username + app password
    IMAP-->>App: Connection established
    App->>IMAP: Open INBOX folder
    IMAP->>Inbox: Search for test code
    Inbox-->>IMAP: Email found
    App->>IMAP: Open "Bulk Mail" folder
    IMAP->>Inbox: Search in spam
    Inbox-->>IMAP: Check spam folder
    IMAP-->>App: Email location determined
```

---

## 🚀 Deployment Flow

```mermaid
graph TB
    A[Local Development] --> B[Git Push to GitHub]
    B --> C{Deploy Where?}
    
    C -->|Frontend| D[Vercel/Netlify]
    C -->|Backend| E[Heroku/Railway/Render]
    C -->|Database| F[MongoDB Atlas]
    
    D --> G[Build React App]
    G --> H[Deploy Frontend]
    
    E --> I[Install Dependencies]
    I --> J[Set Environment Variables]
    J --> K[Deploy Backend]
    
    F --> L[Already Running]
    
    H --> M[Live Application]
    K --> M
    L --> M
    
    style A fill:#e1f5ff
    style M fill:#e1ffe1
```

---

## 📈 Performance Metrics

```
Detection Time Breakdown:
┌────────────────────────────────────────┐
│ Activity              │ Time           │
├────────────────────────────────────────┤
│ User sends email      │ 0-30 seconds   │
│ Email delivery        │ 5-30 seconds   │
│ First detection check │ 30 seconds     │
│ Subsequent checks     │ 30s intervals  │
│ Max detection time    │ 5 minutes      │
│ Report generation     │ 2-5 seconds    │
│ Email notification    │ 5-10 seconds   │
├────────────────────────────────────────┤
│ Total (best case)     │ ~2 minutes     │
│ Total (typical)       │ ~4 minutes     │
│ Total (worst case)    │ ~5 minutes     │
└────────────────────────────────────────┘
```

---

## 🎯 Key Features Summary

| Feature | Status | Description |
|---------|--------|-------------|
| 5 Test Inboxes | ✅ | Gmail (2), Outlook (2), Yahoo (1) |
| Unique Test Code | ✅ | 8-character alphanumeric code |
| Auto Detection | ✅ | Checks Inbox, Spam, Promotions |
| Real-time Progress | ✅ | Live updates every 10 seconds |
| Deliverability Score | ✅ | Percentage based on inbox delivery |
| Email Report | ✅ | HTML email with results |
| Shareable Link | ✅ | Hosted report URL |
| PDF Export | ✅ | Download as PDF |
| Test History | ✅ | View past tests |
| Responsive UI | ✅ | Mobile-friendly design |

---

## 🐛 Error Handling

```mermaid
graph TD
    A[Error Occurs] --> B{Error Type?}
    
    B -->|API Error| C[Log Error]
    B -->|Email Service| D[Retry Logic]
    B -->|Database| E[Connection Retry]
    B -->|User Input| F[Validation Message]
    
    C --> G[Return Error Response]
    D --> H{Max Retries?}
    H -->|No| I[Retry After Delay]
    H -->|Yes| J[Mark as Failed]
    E --> K[Reconnect DB]
    F --> L[Show Error to User]
    
    I --> A
    J --> L
    K --> A
    
    style A fill:#ffe1e1
    style L fill:#fff4e1
```

---

## 📱 Responsive Design Breakpoints

```
Desktop (≥1024px)
┌─────────────────────────────────────────────┐
│  [Header]                                   │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐       │
│  │ Inbox 1 │ │ Inbox 2 │ │ Inbox 3 │  ...  │
│  └─────────┘ └─────────┘ └─────────┘       │
└─────────────────────────────────────────────┘

Tablet (768px - 1023px)
┌────────────────────────────┐
│  [Header]                  │
│  ┌──────────┐ ┌──────────┐ │
│  │ Inbox 1  │ │ Inbox 2  │ │
│  └──────────┘ └──────────┘ │
│  ┌──────────┐ ┌──────────┐ │
│  │ Inbox 3  │ │ Inbox 4  │ │
│  └──────────┘ └──────────┘ │
└────────────────────────────┘

Mobile (<768px)
┌──────────────┐
│  [Header]    │
│  ┌──────────┐│
│  │ Inbox 1  ││
│  └──────────┘│
│  ┌──────────┐│
│  │ Inbox 2  ││
│  └──────────┘│
│  ┌──────────┐│
│  │ Inbox 3  ││
│  └──────────┘│
└──────────────┘
```

---

## 🔧 Tech Stack Details

```mermaid
graph TB
    subgraph "Frontend - React.js"
        A[React 18.2.0]
        B[React Router 6.18.0]
        C[Axios 1.5.1]
        D[Lucide React 0.292.0]
        E[React Hot Toast 2.4.1]
    end
    
    subgraph "Backend - Node.js"
        F[Express.js 4.18.2]
        G[Mongoose 7.6.3]
        H[Nodemailer 6.9.7]
        I[PDFKit 0.13.0]
    end
    
    subgraph "Email APIs"
        J[Google APIs 128.0.0]
        K[Microsoft Graph 3.0.7]
        L[Node IMAP 0.8.19]
    end
    
    subgraph "Database"
        M[MongoDB Atlas]
    end
    
    A --> F
    B --> F
    C --> F
    F --> G
    F --> H
    F --> I
    F --> J
    F --> K
    F --> L
    G --> M
    
    style A fill:#61dafb
    style F fill:#68a063
    style M fill:#4db33d
```

---

## 📝 Environment Variables

```env
# Backend Environment Variables

# Server
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://your-frontend-url.com

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname

# Gmail Test Accounts
GMAIL_1_EMAIL=test1@gmail.com
GMAIL_1_CLIENT_ID=xxx.apps.googleusercontent.com
GMAIL_1_CLIENT_SECRET=GOCSPX-xxxxx
GMAIL_1_REFRESH_TOKEN=1//xxxxx

GMAIL_2_EMAIL=test2@gmail.com
GMAIL_2_CLIENT_ID=xxx.apps.googleusercontent.com
GMAIL_2_CLIENT_SECRET=GOCSPX-xxxxx
GMAIL_2_REFRESH_TOKEN=1//xxxxx

# Outlook Test Accounts
OUTLOOK_1_EMAIL=test1@outlook.com
OUTLOOK_1_CLIENT_ID=xxxxx
OUTLOOK_1_CLIENT_SECRET=xxxxx
OUTLOOK_1_TENANT_ID=xxxxx

OUTLOOK_2_EMAIL=test2@outlook.com
OUTLOOK_2_CLIENT_ID=xxxxx
OUTLOOK_2_CLIENT_SECRET=xxxxx
OUTLOOK_2_TENANT_ID=xxxxx

# Yahoo Test Account
YAHOO_EMAIL=test@yahoo.com
YAHOO_PASSWORD=app_specific_password

# SMTP for Reports
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your_app_password
```

---

## 🎓 Learning Resources

### Setup Guides

1. **Gmail API Setup**
   - Visit: https://console.cloud.google.com/
   - Create project → Enable Gmail API → Create OAuth credentials
   - Get Client ID, Secret, and Refresh Token

2. **Microsoft Graph Setup**
   - Visit: https://portal.azure.com/
   - Register app → API permissions → Generate credentials
   - Get Client ID, Secret, and Tenant ID

3. **Yahoo App Password**
   - Visit: https://login.yahoo.com/account/security
   - Enable 2FA → Generate app password
   - Use app password for IMAP authentication

4. **MongoDB Atlas**
   - Visit: https://www.mongodb.com/cloud/atlas
   - Create cluster → Create database user
   - Get connection string

---

## 🤝 Contributing

Want to improve this workflow? Suggestions:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/HeyVikas5/email-spam-report-tool/issues)
- **Discussions**: [GitHub Discussions](https://github.com/HeyVikas5/email-spam-report-tool/discussions)
- **Email**: your-email@example.com

---

## 📄 License

This project is licensed under the MIT License.

---

**Made with ❤️ by [HeyVikas5](https://github.com/HeyVikas5)**

> Last Updated: October 16, 2025