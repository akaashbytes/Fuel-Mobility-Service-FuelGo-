# NexFuel Tracking Service Testing & Collection Strategy

This document outlines the testing methodologies (Unit & Integration) and provides standard JSON collection formats for Postman API validations.

---

## 1. Unit Testing Strategy

Unit tests are written using **JUnit 5** and **Mockito** to test business logic in isolation by mocking document repository layers and dependent services.

### Target Areas & Mock Bindings:
- **`ProviderLocationServiceTest`**:
  - Mock `ProviderLocationRepository`.
  - Validate location update checks (throws `BaseException` if provider status is not AVAILABLE or ON_JOB).
  - Verify that distance calculation and nearest provider lookup logic (Haversine formula) filter correctly based on coordinates.
- **`OrderTrackingServiceTest`**:
  - Mock `OrderTrackingRepository`.
  - Validate that updating order tracking appends coordinates to the timeline history list and updates the ETA and distance correctly.

---

## 2. Integration Testing Strategy

Integration tests load the full Spring context (`@SpringBootTest`) using an in-memory MongoDB database (e.g., `de.flapdoodle.embed.mongo`) or **Testcontainers** running a lightweight MongoDB Docker container.

### Core Mappings to Verify:
1. **Security Filters Validation**:
   - Query `/api/v1/tracking/dashboard` without administrator privileges or headers. Verify it returns `403 Forbidden` or `401 Unauthorized`.
   - Query with header `X-User-Id: 1` and `X-User-Roles: ROLE_ADMIN` and verify authorized access.
2. **Transaction Integrity**:
   - Verify that updates to provider location and order timeline successfully persist in their respective MongoDB collections: `provider_locations`, `order_tracking`, and `notifications`.

---

## 3. Postman Collection Examples

Import this raw JSON collection directly into Postman to validate tracking flows:

```json
{
  "info": {
    "name": "NexFuel Tracking Service API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Update Provider Location",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "X-User-Id",
            "value": "101",
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
          "raw": "{\n  \"providerId\": 101,\n  \"latitude\": 12.9562,\n  \"longitude\": 77.5894,\n  \"status\": \"AVAILABLE\"\n}"
        },
        "url": {
          "raw": "http://localhost:8080/api/v1/tracking/location",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8080",
          "path": ["api", "v1", "tracking", "location"]
        }
      }
    },
    {
      "name": "Get Provider Location",
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
          "raw": "http://localhost:8080/api/v1/tracking/provider/101",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8080",
          "path": ["api", "v1", "tracking", "provider", "101"]
        }
      }
    },
    {
      "name": "Find Nearest Providers",
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
          "raw": "http://localhost:8080/api/v1/tracking/provider/nearest?latitude=12.9716&longitude=77.5946&radiusKm=10.0",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8080",
          "path": ["api", "v1", "tracking", "provider", "nearest"],
          "query": [
            {
              "key": "latitude",
              "value": "12.9716"
            },
            {
              "key": "longitude",
              "value": "77.5946"
            },
            {
              "key": "radiusKm",
              "value": "10.0"
            }
          ]
        }
      }
    },
    {
      "name": "Start Tracking Order Journey",
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
          "raw": "http://localhost:8080/api/v1/tracking/order/start?orderId=1001&providerId=101&customerId=200",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8080",
          "path": ["api", "v1", "tracking", "order", "start"],
          "query": [
            {
              "key": "orderId",
              "value": "1001"
            },
            {
              "key": "providerId",
              "value": "101"
            },
            {
              "key": "customerId",
              "value": "200"
            }
          ]
        }
      }
    },
    {
      "name": "Update Order Tracking Timeline",
      "request": {
        "method": "PUT",
        "header": [
          {
            "key": "X-User-Id",
            "value": "101",
            "type": "text"
          }
        ],
        "url": {
          "raw": "http://localhost:8080/api/v1/tracking/order/1001?latitude=12.9682&longitude=77.5912&status=EN_ROUTE",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8080",
          "path": ["api", "v1", "tracking", "order", "1001"],
          "query": [
            {
              "key": "latitude",
              "value": "12.9682"
            },
            {
              "key": "longitude",
              "value": "77.5912"
            },
            {
              "key": "status",
              "value": "EN_ROUTE"
            }
          ]
        }
      }
    },
    {
      "name": "Get Order Tracking Stats",
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
          "raw": "http://localhost:8080/api/v1/tracking/order/1001",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8080",
          "path": ["api", "v1", "tracking", "order", "1001"]
        }
      }
    },
    {
      "name": "Broadcast Notification Alert",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "X-User-Id",
            "value": "101",
            "type": "text"
          }
        ],
        "url": {
          "raw": "http://localhost:8080/api/v1/tracking/notifications?userId=200&userRole=CUSTOMER&title=Out%20For%20Delivery&message=Your%20fuel%20is%20on%20the%20way",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8080",
          "path": ["api", "v1", "tracking", "notifications"],
          "query": [
            {
              "key": "userId",
              "value": "200"
            },
            {
              "key": "userRole",
              "value": "CUSTOMER"
            },
            {
              "key": "title",
              "value": "Out For Delivery"
            },
            {
              "key": "message",
              "value": "Your fuel is on the way"
            }
          ]
        }
      }
    },
    {
      "name": "List User Alerts History",
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
          "raw": "http://localhost:8080/api/v1/tracking/notifications",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8080",
          "path": ["api", "v1", "tracking", "notifications"]
        }
      }
    },
    {
      "name": "Mark Alert as Read",
      "request": {
        "method": "PUT",
        "header": [
          {
            "key": "X-User-Id",
            "value": "200",
            "type": "text"
          }
        ],
        "url": {
          "raw": "http://localhost:8080/api/v1/tracking/notifications/NOTIFICATION_ID_HERE/read",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8080",
          "path": ["api", "v1", "tracking", "notifications", "NOTIFICATION_ID_HERE", "read"]
        }
      }
    },
    {
      "name": "Get Live Logistics Dashboard",
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
          "raw": "http://localhost:8080/api/v1/tracking/dashboard",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8080",
          "path": ["api", "v1", "tracking", "dashboard"]
        }
      }
    }
  ]
}
```
