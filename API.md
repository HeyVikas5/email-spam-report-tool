# 📡 API Documentation

Complete API reference for the Email Spam Report Tool.

## Base URL

```
Development: http://localhost:5000/api
Production: https://your-api-url.com/api
```

## Authentication

Currently, no authentication is required for testing purposes. In production, implement JWT or API keys.

## Endpoints

### 1. Get Test Inboxes

Get list of available test email inboxes.

```http
GET /api/tests/inboxes
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "email": "test1@gmail.com",
      "provider": "Gmail"
    },
    {
      "id": 2,
      "email": "test2@gmail.com",
      "provider": "Gmail"
    },
    {
      "id": 3,
      "email": "test1@outlook.com",
      "provider": "Outlook"
    },
    {
      "id": 4,
      "email": "test2@outlook.com",
      "provider": "Outlook"
    },
    {
      "id": 5,
      "email": "test@yahoo.com",
      "provider": "Yahoo"
    }
  ]
}
```

---

### 2. Create Test

Create a new deliverability test.

```http
POST /api/tests
Content-Type: application/json
```

**Request Body:**

```json
{
  "userEmail": "user@example.com"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Test created successfully",
  "data": {
    "testId": "67305ec49f1b2c72b8c8e4f1a",
    "testCode": "TEST-A1B2C3D4",
    "userEmail": "user@example.com",
    "testInboxes": [
      {
        "id": 1,
        "email": "test1@gmail.com",
        "provider": "Gmail"
      }
      // ... 4 more inboxes
    ],
    "createdAt": "2025-10-16T18:23:25.000Z"
  }
}
```

**Error Response:**

```json
{
  "success": false,
  "message": "User email is required"
}
```

---

### 3. Start Test Detection

Start the email detection process.

```http
POST /api/tests/:testId/start
```

**Parameters:**
- `testId` (string, required): The test ID returned from create test

**Response:**

```json
{
  "success": true,
  "message": "Test detection started",
  "data": {
    "testId": "67305ec49f1b2c72b8c8e4f1a",
    "testCode": "TEST-A1B2C3D4",
    "status": "processing"
  }
}
```

**Error Response:**

```json
{
  "success": false,
  "message": "Test has already been started or completed"
}
```

---

### 4. Get Test Status

Get current status of a test (for polling).

```http
GET /api/tests/:testId/status
```

**Parameters:**
- `testId` (string, required): The test ID

**Response:**

```json
{
  "success": true,
  "data": {
    "testId": "67305ec49f1b2c72b8c8e4f1a",
    "testCode": "TEST-A1B2C3D4",
    "userEmail": "user@example.com",
    "status": "processing",
    "testInboxes": [
      {
        "id": 1,
        "email": "test1@gmail.com",
        "provider": "Gmail",
        "status": "detected",
        "folder": "inbox",
        "receivedAt": "2025-10-16T18:25:30.000Z",
        "checkCount": 3
      },
      {
        "id": 2,
        "email": "test2@gmail.com",
        "provider": "Gmail",
        "status": "detected",
        "folder": "spam",
        "receivedAt": "2025-10-16T18:25:35.000Z",
        "checkCount": 4
      },
      {
        "id": 3,
        "email": "test1@outlook.com",
        "provider": "Outlook",
        "status": "checking",
        "folder": null,
        "receivedAt": null,
        "checkCount": 2
      }
      // ... more inboxes
    ],
    "deliverabilityScore": 0,
    "reportUrl": null,
    "completedAt": null,
    "createdAt": "2025-10-16T18:23:25.000Z"
  }
}
```

---

### 5. Get Test by Code

Get test details by test code.

```http
GET /api/tests/code/:testCode
```

**Parameters:**
- `testCode` (string, required): The test code (e.g., TEST-A1B2C3D4)

**Response:**

Same as "Get Test Status"

---

### 6. Get Report

Get report by test code.

```http
GET /api/reports/:testCode
```

**Parameters:**
- `testCode` (string, required): The test code

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "67305ec49f1b2c72b8c8e4f1b",
    "testId": "67305ec49f1b2c72b8c8e4f1a",
    "testCode": "TEST-A1B2C3D4",
    "userEmail": "user@example.com",
    "summary": {
      "totalInboxes": 5,
      "inbox": 2,
      "spam": 2,
      "promotions": 1,
      "notFound": 0,
      "deliverabilityScore": 40
    },
    "details": [
      {
        "provider": "Gmail",
        "email": "test1@gmail.com",
        "folder": "inbox",
        "receivedAt": "2025-10-16T18:25:30.000Z",
        "status": "detected"
      },
      {
        "provider": "Gmail",
        "email": "test2@gmail.com",
        "folder": "spam",
        "receivedAt": "2025-10-16T18:25:35.000Z",
        "status": "detected"
      }
      // ... more details
    ],
    "reportUrl": "https://your-app.com/report/TEST-A1B2C3D4",
    "emailSent": true,
    "emailSentAt": "2025-10-16T18:28:00.000Z",
    "createdAt": "2025-10-16T18:27:45.000Z"
  }
}
```

---

### 7. Get Report History

Get user's test history.

```http
GET /api/reports/history/user?userEmail=user@example.com&limit=10
```

**Query Parameters:**
- `userEmail` (string, required): User's email address
- `limit` (number, optional): Number of results (default: 10, max: 50)

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "_id": "67305ec49f1b2c72b8c8e4f1b",
      "testCode": "TEST-A1B2C3D4",
      "summary": {
        "deliverabilityScore": 40,
        "inbox": 2,
        "spam": 2,
        "promotions": 1,
        "notFound": 0
      },
      "createdAt": "2025-10-16T18:27:45.000Z"
    }
    // ... more reports
  ]
}
```

---

### 8. Download Report PDF

Download report as PDF file.

```http
GET /api/reports/:testCode/pdf
```

**Parameters:**
- `testCode` (string, required): The test code

**Response:**
- Content-Type: `application/pdf`
- Content-Disposition: `attachment; filename=report-TEST-A1B2C3D4.pdf`
- Binary PDF data

---

## Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (validation error) |
| 404 | Not Found |
| 500 | Internal Server Error |

## Error Response Format

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error (only in development)"
}
```

## Rate Limiting

- 100 requests per 15 minutes per IP
- Test creation: 5 per hour per IP
- Report generation: 10 per hour per user email

## Folder Types

| Folder | Description |
|--------|-------------|
| `inbox` | Email delivered to main inbox |
| `spam` | Email marked as spam/junk |
| `promotions` | Email in promotions/marketing folder (Gmail) |
| `not_found` | Email not detected after all retries |

## Test Status Types

| Status | Description |
|--------|-------------|
| `pending` | Test created, waiting for user to send email |
| `processing` | Detection process running |
| `completed` | All inboxes checked, report generated |
| `failed` | Test failed due to error |

## Inbox Status Types

| Status | Description |
|--------|-------------|
| `pending` | Not yet checked |
| `checking` | Currently being checked |
| `detected` | Email found |
| `not_found` | Email not found after max retries |
| `error` | Error occurred during checking |

---

**Continue reading:**
- [Main Workflow](WORKFLOW.md)
- [Architecture](ARCHITECTURE.md)
- [Setup Guide](SETUP.md)