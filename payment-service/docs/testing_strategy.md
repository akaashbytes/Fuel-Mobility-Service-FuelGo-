# NexFuel Payment Service Testing & Collection Strategy

This document outlines the testing methodologies (Unit & Integration) and provides standard JSON collection formats for Postman API validations.

---

## 1. Unit Testing Strategy

Unit tests are written using **JUnit 5** and **Mockito** to test business logic in isolation by mocking repository layers and dependent services.

### Target Areas & Mock Bindings:
- **`PaymentServiceTest`**:
  - Mock `PaymentRepository`, `InvoiceService`, `LedgerService`, and `SettlementService`.
  - Validate payment execution checks (throws error if invoice is not PENDING).
  - Verify that successful payment transitions invoice status to `PAID`.
  - Verify credit ledger entries are generated for fuel revenue, tax collection, and platform commissions.
  - Verify provider settlement calculation is triggered.
- **`SettlementServiceTest`**:
  - Mock `ProviderSettlementRepository` and `LedgerService`.
  - Test payout split (85% to provider, 15% platform commission).
  - Validate transition of settlement states and creation of provider payout debit ledger entries.

---

## 2. Integration Testing Strategy

Integration tests load the full Spring context (`@SpringBootTest`) using an in-memory database (e.g. H2 in Oracle Mode) or **Testcontainers** running a lightweight Oracle XE container.

### Core Mappings to Verify:
1. **Security Filters Validation**:
   - Query `/api/v1/payments/dashboard` without headers. Verify it returns `401 Unauthorized`.
   - Query with header `X-User-Id: 101` and verify authorized access.
2. **Transaction Integrity**:
   - Verify that invoice generation and payment completion persist atomic updates to database tables: `ORDER_INVOICES`, `PAYMENTS`, `PAYMENT_TRANSACTIONS`, `PROVIDER_SETTLEMENTS`, and `COMPANY_LEDGER`.

---

## 3. Postman Collection Examples

Import this raw JSON collection directly into Postman to validate payment flows:

```json
{
  "info": {
    "name": "NexFuel Payment Service API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Create Order Invoice",
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
          "raw": "http://localhost:8080/api/v1/payments/invoices?orderId=1001&amount=85.50",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8080",
          "path": ["api", "v1", "payments", "invoices"],
          "query": [
            {
              "key": "orderId",
              "value": "1001"
            },
            {
              "key": "amount",
              "value": "85.50"
            }
          ]
        }
      }
    },
    {
      "name": "Execute Payment",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "X-User-Id",
            "value": "1",
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
          "raw": "{\n  \"invoiceId\": 1,\n  \"paymentMethod\": \"CREDIT_CARD\",\n  \"paymentGateway\": \"STRIPE\"\n}"
        },
        "url": {
          "raw": "http://localhost:8080/api/v1/payments",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8080",
          "path": ["api", "v1", "payments"]
        }
      }
    },
    {
      "name": "Get Payment Details",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "X-User-Id",
            "value": "1",
            "type": "text"
          }
        ],
        "url": {
          "raw": "http://localhost:8080/api/v1/payments/1",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8080",
          "path": ["api", "v1", "payments", "1"]
        }
      }
    },
    {
      "name": "Get Payment History",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "X-User-Id",
            "value": "1",
            "type": "text"
          }
        ],
        "url": {
          "raw": "http://localhost:8080/api/v1/payments/history",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8080",
          "path": ["api", "v1", "payments", "history"]
        }
      }
    },
    {
      "name": "Process Provider Settlement Payout",
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
          "raw": "http://localhost:8080/api/v1/payments/settlements?settlementId=1",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8080",
          "path": ["api", "v1", "payments", "settlements"],
          "query": [
            {
              "key": "settlementId",
              "value": "1"
            }
          ]
        }
      }
    },
    {
      "name": "Get Settlements List",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "X-User-Id",
            "value": "1",
            "type": "text"
          }
        ],
        "url": {
          "raw": "http://localhost:8080/api/v1/payments/settlements?providerId=101",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8080",
          "path": ["api", "v1", "payments", "settlements"],
          "query": [
            {
              "key": "providerId",
              "value": "101"
            }
          ]
        }
      }
    },
    {
      "name": "Get Financial Ledger Dashboard",
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
          "raw": "http://localhost:8080/api/v1/payments/dashboard",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8080",
          "path": ["api", "v1", "payments", "dashboard"]
        }
      }
    }
  ]
}
```
