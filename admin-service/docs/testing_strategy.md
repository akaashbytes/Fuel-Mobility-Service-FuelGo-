# NexFuel Admin Service Testing & Collection Strategy

This document outlines the testing methodologies (Unit & Integration) and provides standard JSON collection formats for Postman API validations.

---

## 1. Unit Testing Strategy

Unit tests are written using **JUnit 5** and **Mockito** to test aggregation logic, fallback safety rules, and JPA configurations in isolation.

### Target Areas & Mock Bindings:
- **`AdminDashboardServiceImplTest`**:
  - Mock all 6 downstream Feign clients (`OrderServiceClient`, `PaymentServiceClient`, `FeedbackServiceClient`, `TrackingServiceClient`, `CollaboratorServiceClient`, `AnalyticsServiceClient`).
  - Validate successful aggregation of the combined dashboard payload.
  - **Resilience Test**: Verify that if one or more clients return `null` or throw connectivity exceptions, the service catches the error, logs it, and continues aggregating from other services (safeguarding dashboard stability).
- **`AdminApprovalServiceImplTest`**:
  - Mock `ProviderServiceClient`, `CollaboratorServiceClient`, and `AdminActionLogRepository`.
  - Validate that updating a provider status dispatches correct values downstream and logs an `AdminActionLogEntity` in the database.
  - Validate that updating a collaborator status fetches the existing collaborator first, performs properties mapping, dispatches updates downstream, and logs auditing logs.
- **`SystemConfigurationServiceImplTest`**:
  - Mock `SystemConfigurationRepository` and `AdminActionLogRepository`.
  - Validate CRUD operations for variables and auditing actions.

---

## 2. Integration Testing Strategy

Integration tests load the full Spring context (`@SpringBootTest`) using an in-memory database (e.g. H2 in Oracle Mode) or **Testcontainers** representing Oracle XE.

### Core Mappings to Verify:
1. **Security & Authorization Checks**:
   - Query `/api/v1/admin/dashboard` without authentication headers. Verify it returns `401 Unauthorized`.
   - Query with `X-User-Roles: ROLE_CUSTOMER`. Verify it returns `403 Forbidden`.
   - Query with `X-User-Roles: ROLE_ADMIN` and `X-User-Id: 1`. Verify authorization is accepted.
2. **Database Schema Setup**:
   - Verify JPA entity listeners automatically write `createdAt`/`updatedAt` auditing metadata on insertions.
   - Verify sequences populate IDs sequentially for `ADMIN_NOTIFICATIONS`, `ADMIN_ACTION_LOGS`, and `SYSTEM_CONFIGURATIONS` tables.

---

## 3. Postman Collection Examples

Import this raw JSON collection directly into Postman to validate administrative endpoints:

```json
{
  "info": {
    "name": "NexFuel Admin Service API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Get Consolidated Admin Dashboard",
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
          "raw": "http://localhost:8080/api/v1/admin/dashboard",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8080",
          "path": ["api", "v1", "admin", "dashboard"]
        }
      }
    },
    {
      "name": "Approve Provider Account",
      "request": {
        "method": "PUT",
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
          "raw": "http://localhost:8080/api/v1/admin/approvals/providers/101?status=ACTIVE",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8080",
          "path": ["api", "v1", "admin", "approvals", "providers", "101"],
          "query": [
            {
              "key": "status",
              "value": "ACTIVE"
            }
          ]
        }
      }
    },
    {
      "name": "Update Collaborator Bunk Status",
      "request": {
        "method": "PUT",
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
          "raw": "http://localhost:8080/api/v1/admin/approvals/collaborators/1?status=ACTIVE_PARTNER",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8080",
          "path": ["api", "v1", "admin", "approvals", "collaborators", "1"],
          "query": [
            {
              "key": "status",
              "value": "ACTIVE_PARTNER"
            }
          ]
        }
      }
    },
    {
      "name": "Get All Global Configurations",
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
          "raw": "http://localhost:8080/api/v1/admin/configurations",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8080",
          "path": ["api", "v1", "admin", "configurations"]
        }
      }
    },
    {
      "name": "Save Configuration Key Value",
      "request": {
        "method": "PUT",
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
          "raw": "http://localhost:8080/api/v1/admin/configurations?key=tax_rate&value=0.10&description=System%20tax%20percentage%20value",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8080",
          "path": ["api", "v1", "admin", "configurations"],
          "query": [
            {
              "key": "key",
              "value": "tax_rate"
            },
            {
              "key": "value",
              "value": "0.10"
            },
            {
              "key": "description",
              "value": "System tax percentage value"
            }
          ]
        }
      }
    },
    {
      "name": "Get Admin Alerts Notifications",
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
          "raw": "http://localhost:8080/api/v1/admin/notifications",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8080",
          "path": ["api", "v1", "admin", "notifications"]
        }
      }
    },
    {
      "name": "Mark Admin Alert as Read",
      "request": {
        "method": "PUT",
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
          "raw": "http://localhost:8080/api/v1/admin/notifications/1/read",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8080",
          "path": ["api", "v1", "admin", "notifications", "1", "read"]
        }
      }
    },
    {
      "name": "Get Auditable Action History Logs",
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
          "raw": "http://localhost:8080/api/v1/admin/logs",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8080",
          "path": ["api", "v1", "admin", "logs"]
        }
      }
    }
  ]
}
```
