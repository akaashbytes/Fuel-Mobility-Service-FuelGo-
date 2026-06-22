# NexFuel Order Service Testing & Collection Strategy

This document outlines the testing methodologies (Unit & Integration) and provides standard JSON collection formats for Postman API validations for the **Order Microservice** (`order-service`).

---

## 1. Unit Testing Strategy

Unit tests are written using **JUnit 5** and **Mockito** to test order status transitions, calculations, provider assignments, and OTP verification workflows in isolation by mocking database repositories.

### Target Areas & Mock Bindings:
- **`OrderServiceTest`**:
  - Mock `OrderRepository`, `OrderAssignmentRepository`, `OrderStatusHistoryRepository`, and `OrderOtpVerificationRepository`.
  - Validate state progression rules (e.g. `PENDING` -> `ASSIGNED` -> `ACCEPTED` -> `EN_ROUTE` -> `ARRIVED` -> `FUEL_DELIVERED` -> `OTP_VERIFIED` -> `COMPLETED`).
  - Verify that attempting to regress state (e.g. from `COMPLETED` back to any state, or backwards progression) throws `OrderStateException`.
  - Verify that transitioning directly to `COMPLETED` without having transitioned to `OTP_VERIFIED` throws `OrderStateException`.
  - Verify that OTP generation operates correctly when status transitions to `FUEL_DELIVERED`.
  - Verify that validation succeeds only when OTP matches, is not expired, and transitions order to `COMPLETED` state.
- **`OrderDashboardServiceTest`**:
  - Mock `OrderRepository` and `OrderService`.
  - Verify correct calculations for total, pending, active, completed, and cancelled orders.

### Example Unit Test Skeleton (`OrderServiceTest.java`)
```java
package com.nexfuel.order.service;

import com.nexfuel.order.dto.OrderStatusUpdateRequest;
import com.nexfuel.order.entity.OrderEntity;
import com.nexfuel.order.entity.OrderState;
import com.nexfuel.order.exception.OrderStateException;
import com.nexfuel.order.repository.OrderAssignmentRepository;
import com.nexfuel.order.repository.OrderOtpVerificationRepository;
import com.nexfuel.order.repository.OrderRepository;
import com.nexfuel.order.repository.OrderStatusHistoryRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private OrderAssignmentRepository orderAssignmentRepository;

    @Mock
    private OrderStatusHistoryRepository orderStatusHistoryRepository;

    @Mock
    private OrderOtpVerificationRepository orderOtpVerificationRepository;

    @InjectMocks
    private OrderService orderService;

    @Test
    void updateStatus_ShouldThrowException_WhenAttemptingRegressiveTransition() {
        Long orderId = 1L;
        OrderEntity order = new OrderEntity();
        order.setId(orderId);
        order.setStatus(OrderState.ACCEPTED);

        when(orderRepository.findById(orderId)).thenReturn(Optional.of(order));

        OrderStatusUpdateRequest request = new OrderStatusUpdateRequest();
        request.setStatus(OrderState.ASSIGNED); // Regressive transition: ACCEPTED -> ASSIGNED
        request.setChangedBy("TEST_USER");
        request.setNotes("Test regressive status update");

        assertThrows(OrderStateException.class, () ->
                orderService.updateStatus(orderId, request)
        );
    }
}
```

---

## 2. Integration Testing Strategy

Integration tests load the Spring Boot web context using MockMvc to check authorization filters, header propagation pipelines, and database updates.

### Core Mappings to Verify:
1. **Header Authentication**:
   - Query `POST /api/v1/orders` without headers. Verify it returns `401 Unauthorized` or `403 Forbidden` because the security filter blocks unauthenticated contexts.
   - Query `POST /api/v1/orders` passing headers `X-User-Id: 2000` and `X-User-Roles: ROLE_CUSTOMER`. Verify it successfully resolves context and creates the order.
2. **Transaction Integrity**:
   - Verify that when an order transitions to `COMPLETED` after a successful OTP match, both the OTP status updates to `VERIFIED` and the order status updates to `COMPLETED` in the database within a single transaction.

---

## 3. Postman Collection Examples

You can import this JSON collection directly into Postman to test all endpoints.

```json
{
  "info": {
    "name": "NexFuel Order Service API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Create Order Request",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "X-User-Id",
            "value": "2000",
            "type": "text"
          },
          {
            "key": "X-User-Roles",
            "value": "ROLE_CUSTOMER",
            "type": "text"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"vehicleId\": 500,\n  \"fuelType\": \"Diesel\",\n  \"quantityGallons\": 15.5,\n  \"targetLatitude\": 37.7749,\n  \"targetLongitude\": -122.4194,\n  \"targetAddress\": \"123 Market St, San Francisco, CA\"\n}",
          "options": {
            "raw": {
              "language": "json"
            }
          }
        ],
        "url": {
          "raw": "http://localhost:8085/api/v1/orders",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8085",
          "path": ["api", "v1", "orders"]
        }
      }
    },
    {
      "name": "Get Order By ID",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "X-User-Id",
            "value": "2000",
            "type": "text"
          },
          {
            "key": "X-User-Roles",
            "value": "ROLE_CUSTOMER",
            "type": "text"
          }
        ],
        "url": {
          "raw": "http://localhost:8085/api/v1/orders/1",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8085",
          "path": ["api", "v1", "orders", "1"]
        }
      }
    },
    {
      "name": "Get Customer Order History",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "X-User-Id",
            "value": "2000",
            "type": "text"
          },
          {
            "key": "X-User-Roles",
            "value": "ROLE_CUSTOMER",
            "type": "text"
          }
        ],
        "url": {
          "raw": "http://localhost:8085/api/v1/orders/customer",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8085",
          "path": ["api", "v1", "orders", "customer"]
        }
      }
    },
    {
      "name": "Assign Provider",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "X-User-Id",
            "value": "1000",
            "type": "text"
          },
          {
            "key": "X-User-Roles",
            "value": "ROLE_ADMIN",
            "type": "text"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"providerId\": 300\n}",
          "options": {
            "raw": {
              "language": "json"
            }
          }
        ],
        "url": {
          "raw": "http://localhost:8085/api/v1/orders/1/assign",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8085",
          "path": ["api", "v1", "orders", "1", "assign"]
        }
      }
    },
    {
      "name": "Update Status (ACCEPTED)",
      "request": {
        "method": "PUT",
        "header": [
          {
            "key": "X-User-Id",
            "value": "300",
            "type": "text"
          },
          {
            "key": "X-User-Roles",
            "value": "ROLE_PROVIDER",
            "type": "text"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"status\": \"ACCEPTED\",\n  \"changedBy\": \"PROVIDER\",\n  \"notes\": \"Provider accepted order request.\"\n}",
          "options": {
            "raw": {
              "language": "json"
            }
          }
        ],
        "url": {
          "raw": "http://localhost:8085/api/v1/orders/1/status",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8085",
          "path": ["api", "v1", "orders", "1", "status"]
        }
      }
    },
    {
      "name": "Update Status (FUEL_DELIVERED - Triggers OTP)",
      "request": {
        "method": "PUT",
        "header": [
          {
            "key": "X-User-Id",
            "value": "300",
            "type": "text"
          },
          {
            "key": "X-User-Roles",
            "value": "ROLE_PROVIDER",
            "type": "text"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"status\": \"FUEL_DELIVERED\",\n  \"changedBy\": \"PROVIDER\",\n  \"notes\": \"Fuel delivered to customer vehicle.\"\n}",
          "options": {
            "raw": {
              "language": "json"
            }
          }
        ],
        "url": {
          "raw": "http://localhost:8085/api/v1/orders/1/status",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8085",
          "path": ["api", "v1", "orders", "1", "status"]
        }
      }
    },
    {
      "name": "Verify OTP (Accepts OTP from logs, transitions to COMPLETED)",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "X-User-Id",
            "value": "300",
            "type": "text"
          },
          {
            "key": "X-User-Roles",
            "value": "ROLE_PROVIDER",
            "type": "text"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"otpCode\": \"123456\"\n}",
          "options": {
            "raw": {
              "language": "json"
            }
          }
        ],
        "url": {
          "raw": "http://localhost:8085/api/v1/orders/1/verify-otp",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8085",
          "path": ["api", "v1", "orders", "1", "verify-otp"]
        }
      }
    },
    {
      "name": "Get Dashboard Metrics",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "X-User-Id",
            "value": "1000",
            "type": "text"
          },
          {
            "key": "X-User-Roles",
            "value": "ROLE_ADMIN",
            "type": "text"
          }
        ],
        "url": {
          "raw": "http://localhost:8085/api/v1/orders/dashboard",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8085",
          "path": ["api", "v1", "orders", "dashboard"]
        }
      }
    },
    {
      "name": "Get Active Service Packages",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "X-User-Id",
            "value": "2000",
            "type": "text"
          },
          {
            "key": "X-User-Roles",
            "value": "ROLE_CUSTOMER",
            "type": "text"
          }
        ],
        "url": {
          "raw": "http://localhost:8085/api/v1/service-packages",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8085",
          "path": ["api", "v1", "service-packages"]
        }
      }
    },
    {
      "name": "Create Service Package",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "X-User-Id",
            "value": "1000",
            "type": "text"
          },
          {
            "key": "X-User-Roles",
            "value": "ROLE_ADMIN",
            "type": "text"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"name\": \"Standard Delivery Service\",\n  \"description\": \"Standard emergency fuel dispatch, flat rate delivery fees applied\",\n  \"price\": 5.00,\n  \"status\": \"ACTIVE\"\n}",
          "options": {
            "raw": {
              "language": "json"
            }
          }
        ],
        "url": {
          "raw": "http://localhost:8085/api/v1/service-packages",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8085",
          "path": ["api", "v1", "service-packages"]
        }
      }
    }
  ]
}
```
