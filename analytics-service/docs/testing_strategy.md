# NexFuel Analytics Service Testing & Collection Strategy

This document outlines the testing methodologies (Unit & Integration) and provides standard JSON collection formats for Postman API validations.

---

## 1. Unit Testing Strategy

Unit tests are written using **JUnit 5** and **Mockito** to test business logic and metric calculations in isolation by mocking MongoDB document repository layers.

### Target Areas & Mock Bindings:
- **`AnalyticsDashboardServiceTest`**:
  - Mock `AnalyticsSnapshotRepository` and `SystemActivityLogRepository`.
  - Validate snapshot generation logic for DAILY, WEEKLY, and MONTHLY snapshot records.
  - Verify retrieval and aggregation of dashboard data, ensuring correct mapping to `AnalyticsDashboardResponse`.
  - Verify that system activity logging persists events correctly.
- **`RevenueAnalyticsServiceTest`**:
  - Mock `AnalyticsSnapshotRepository`.
  - Validate revenue trends compilation, gross margins, growth rate calculations, and average order sizing.
- **`ProviderAnalyticsServiceTest`**:
  - Mock `AnalyticsSnapshotRepository`.
  - Validate calculation of active providers count, average rating scores, and the ranking algorithm of top provider partners.
- **`OrderAnalyticsServiceTest`**:
  - Mock `AnalyticsSnapshotRepository`.
  - Validate calculation of completion and cancellation percentages and overall logistics metrics.
- **`CustomerAnalyticsServiceTest`**:
  - Mock `AnalyticsSnapshotRepository`.
  - Validate calculation of total registrations, active customer accounts, and registration velocity.
- **`CollaboratorAnalyticsServiceTest`**:
  - Mock `AnalyticsSnapshotRepository`.
  - Validate aggregation of bunk partner statistics, total bunk count, and fuel price min/max/average trends.

---

## 2. Integration Testing Strategy

Integration tests load the full Spring context (`@SpringBootTest`) using an in-memory MongoDB instance (such as `de.flapdoodle.embed.mongo`) or **Testcontainers** running a lightweight MongoDB image.

### Core Mappings to Verify:
1. **Security Filters Validation**:
   - Query `/api/v1/analytics/dashboard` without authentication headers. Verify it returns `401 Unauthorized` or `403 Forbidden`.
   - Query with header `X-User-Id: 1` and `X-User-Roles: ROLE_ADMIN` to verify successful authorization and dashboard metrics lookup.
   - Query with non-admin role (e.g., `X-User-Roles: ROLE_CUSTOMER`) and verify access is denied with a `403 Forbidden` response.
2. **Datastore Integrity**:
   - Verify that triggering snapshot creation successfully inserts a new document in the `analytics_snapshots` MongoDB collection.
   - Verify that posting a new activity event successfully persists a new record in the `system_activity_logs` collection.

---

## 3. Postman Collection Examples

Import this raw JSON collection directly into Postman to validate analytics endpoints:

```json
{
  "info": {
    "name": "NexFuel Analytics Service API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Get Analytics Dashboard Overview",
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
          "raw": "http://localhost:8080/api/v1/analytics/dashboard",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8080",
          "path": ["api", "v1", "analytics", "dashboard"]
        }
      }
    },
    {
      "name": "Get Financial Revenue Analytics",
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
          "raw": "http://localhost:8080/api/v1/analytics/revenue?snapshotType=DAILY",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8080",
          "path": ["api", "v1", "analytics", "revenue"],
          "query": [
            {
              "key": "snapshotType",
              "value": "DAILY"
            }
          ]
        }
      }
    },
    {
      "name": "Get Fleet Provider Analytics",
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
          "raw": "http://localhost:8080/api/v1/analytics/providers",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8080",
          "path": ["api", "v1", "analytics", "providers"]
        }
      }
    },
    {
      "name": "Get Order Delivery Metrics",
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
          "raw": "http://localhost:8080/api/v1/analytics/orders?snapshotType=DAILY",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8080",
          "path": ["api", "v1", "analytics", "orders"],
          "query": [
            {
              "key": "snapshotType",
              "value": "DAILY"
            }
          ]
        }
      }
    },
    {
      "name": "Get Customer Registration Analytics",
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
          "raw": "http://localhost:8080/api/v1/analytics/customers",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8080",
          "path": ["api", "v1", "analytics", "customers"]
        }
      }
    },
    {
      "name": "Get Collaborator Analytics",
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
          "raw": "http://localhost:8080/api/v1/analytics/collaborators",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8080",
          "path": ["api", "v1", "analytics", "collaborators"]
        }
      }
    },
    {
      "name": "Trigger Snapshot Creation",
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
          "raw": "http://localhost:8080/api/v1/analytics/snapshots?snapshotType=DAILY",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8080",
          "path": ["api", "v1", "analytics", "snapshots"],
          "query": [
            {
              "key": "snapshotType",
              "value": "DAILY"
            }
          ]
        }
      }
    },
    {
      "name": "Record System Activity Log",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "X-User-Id",
            "value": "101",
            "type": "text"
          },
          {
            "key": "X-User-Roles",
            "value": "ROLE_CUSTOMER",
            "type": "text"
          }
        ],
        "url": {
          "raw": "http://localhost:8080/api/v1/analytics/logs?userId=101&userRole=CUSTOMER&activityType=ORDER_PLACED&description=Order%201001%20placed%20successfully",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8080",
          "path": ["api", "v1", "analytics", "logs"],
          "query": [
            {
              "key": "userId",
              "value": "101"
            },
            {
              "key": "userRole",
              "value": "CUSTOMER"
            },
            {
              "key": "activityType",
              "value": "ORDER_PLACED"
            },
            {
              "key": "description",
              "value": "Order 1001 placed successfully"
            }
          ]
        }
      }
    }
  ]
}
```
