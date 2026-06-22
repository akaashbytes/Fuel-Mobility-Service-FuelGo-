# NexFuel Feedback Service Testing & Collection Strategy

This document outlines the testing methodologies (Unit & Integration) and provides standard JSON collection formats for Postman API validations.

---

## 1. Unit Testing Strategy

Unit tests are written using **JUnit 5** and **Mockito** to test business logic in isolation by mocking repository layers and dependent services.

### Target Areas & Mock Bindings:
- **`FeedbackServiceTest`**:
  - Mock `FeedbackRepository`.
  - Validate feedback submission checks (throws `DuplicateFeedbackException` if feedback exists; throws `InvalidOrderFeedbackException` if order not completed; throws `UnauthorizedFeedbackAccessException` if order ownership check fails).
  - Verify that successful feedback is persisted with rating and comment.
- **`FeedbackResponseServiceTest`**:
  - Mock `FeedbackRepository` and `FeedbackResponseRepository`.
  - Validate that administrator responses are successfully added to feedback records.

---

## 2. Integration Testing Strategy

Integration tests load the full Spring context (`@SpringBootTest`) using an in-memory database (e.g. H2 in Oracle Mode) or **Testcontainers** running a lightweight Oracle XE container.

### Core Mappings to Verify:
1. **Security Filters Validation**:
   - Query `/api/v1/feedback/dashboard` without administrator privileges or headers. Verify it returns `403 Forbidden` or `401 Unauthorized`.
   - Query with header `X-User-Id: 1` and `X-User-Roles: ROLE_ADMIN` and verify authorized access.
2. **Transaction Integrity**:
   - Verify that submitting feedback and recording admin comments persist atomic updates to database tables: `FEEDBACK` and `FEEDBACK_RESPONSES`.

---

## 3. Postman Collection Examples

Import this raw JSON collection directly into Postman to validate feedback flows:

```json
{
  "info": {
    "name": "NexFuel Feedback Service API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Submit Customer Feedback",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "X-User-Id",
            "value": "200",
            "type": "text"
          },
          {
            "key": "Content-Type",
            "value": "application/json",
            "type": "text"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"orderId\": 1002,\n  \"rating\": 5,\n  \"comment\": \"Excellent service, very fast delivery!\"\n}"
        },
        "url": {
          "raw": "http://localhost:8080/api/v1/feedback",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8080",
          "path": ["api", "v1", "feedback"]
        }
      }
    },
    {
      "name": "Get Feedback Details",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "X-User-Id",
            "value": "200",
            "type": "text"
          }
        ],
        "url": {
          "raw": "http://localhost:8080/api/v1/feedback/1",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8080",
          "path": ["api", "v1", "feedback", "1"]
        }
      }
    },
    {
      "name": "Get Provider Review List",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "X-User-Id",
            "value": "200",
            "type": "text"
          }
        ],
        "url": {
          "raw": "http://localhost:8080/api/v1/feedback/provider/101",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8080",
          "path": ["api", "v1", "feedback", "provider", "101"]
        }
      }
    },
    {
      "name": "Get Provider Rating Summary",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "X-User-Id",
            "value": "200",
            "type": "text"
          }
        ],
        "url": {
          "raw": "http://localhost:8080/api/v1/feedback/provider/101/summary",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8080",
          "path": ["api", "v1", "feedback", "provider", "101", "summary"]
        }
      }
    },
    {
      "name": "Get Customer Feedback History",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "X-User-Id",
            "value": "200",
            "type": "text"
          }
        ],
        "url": {
          "raw": "http://localhost:8080/api/v1/feedback/customer",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8080",
          "path": ["api", "v1", "feedback", "customer"]
        }
      }
    },
    {
      "name": "Submit Administrative Response",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "X-User-Id",
            "value": "1",
            "type": "text"
          },
          {
            "key": "X-User-Roles",
            "value": "ROLE_ADMIN",
            "type": "text"
          }
        ],
        "url": {
          "raw": "http://localhost:8080/api/v1/feedback/1/response?responseComment=Thank you for the positive feedback!",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8080",
          "path": ["api", "v1", "feedback", "1", "response"],
          "query": [
            {
              "key": "responseComment",
              "value": "Thank you for the positive feedback!"
            }
          ]
        }
      }
    },
    {
      "name": "Get Admin Feedback Dashboard",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "X-User-Id",
            "value": "1",
            "type": "text"
          },
          {
            "key": "X-User-Roles",
            "value": "ROLE_ADMIN",
            "type": "text"
          }
        ],
        "url": {
          "raw": "http://localhost:8080/api/v1/feedback/dashboard",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8080",
          "path": ["api", "v1", "feedback", "dashboard"]
        }
      }
    }
  ]
}
```
