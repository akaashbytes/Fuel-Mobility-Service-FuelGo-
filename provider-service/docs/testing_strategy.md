# NexFuel Provider Service Testing & Collection Strategy

This document outlines the testing methodologies (Unit & Integration) and provides standard JSON collection formats for Postman API validations.

---

## 1. Unit Testing Strategy

Unit tests are written using **JUnit 5** and **Mockito** to test provider profile, document, and availability logic in isolation by mocking database repository operations.

### Target Areas & Mock Bindings:
- **`ProviderProfileServiceTest`**:
  - Mock `ProviderProfileRepository`.
  - Validate profile lookup (auto-creates a profile record on first fetch if it does not exist with `PENDING` status).
- **`ProviderAvailabilityServiceTest`**:
  - Mock `ProviderAvailabilityRepository` and `ProviderProfileRepository`.
  - Validate status transition:
    - Verify that an unapproved provider (status is `PENDING`) attempting to transition to `AVAILABLE` throws `ProviderApprovalException`.
    - Verify that an approved provider (status is `ACTIVE`) can successfully change status to `AVAILABLE`.
- **`ProviderDocumentServiceTest`**:
  - Mock `ProviderDocumentRepository` and `ProviderProfileRepository`.
  - Validate uploading documents (stores document details linked to provider profile with `PENDING` status).

### Example Unit Test Skeleton (`ProviderAvailabilityServiceTest.java`)
```java
package com.nexfuel.provider.service;

import com.nexfuel.provider.dto.ProviderAvailabilityRequest;
import com.nexfuel.provider.entity.AvailabilityStatus;
import com.nexfuel.provider.entity.ProviderProfileEntity;
import com.nexfuel.provider.entity.ProviderStatus;
import com.nexfuel.provider.exception.ProviderApprovalException;
import com.nexfuel.provider.repository.ProviderAvailabilityRepository;
import com.nexfuel.provider.repository.ProviderProfileRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProviderAvailabilityServiceTest {

    @Mock
    private ProviderAvailabilityRepository providerAvailabilityRepository;

    @Mock
    private ProviderProfileRepository providerProfileRepository;

    @InjectMocks
    private ProviderAvailabilityService providerAvailabilityService;

    @Test
    void updateAvailability_ShouldThrowException_WhenProviderNotApproved() {
        Long userId = 1000L;
        ProviderProfileEntity profile = new ProviderProfileEntity();
        profile.setId(1L);
        profile.setUserId(userId);
        profile.setStatus(ProviderStatus.PENDING); // Unapproved

        when(providerProfileRepository.findByUserId(userId)).thenReturn(Optional.of(profile));

        ProviderAvailabilityRequest request = new ProviderAvailabilityRequest();
        request.setStatus(AvailabilityStatus.AVAILABLE);

        assertThrows(ProviderApprovalException.class, () ->
                providerAvailabilityService.updateAvailability(userId, request)
        );
    }
}
```

---

## 2. Integration Testing Strategy

Integration tests load the Spring Boot servlet container using an in-memory database to verify API bindings and header propagation security pipelines.

### Core Mappings to Verify:
1. **Header Security Context Resolution**:
   - Query `/api/v1/providers/profile` with no headers. Verify it returns `401 Unauthorized` or `403 Forbidden` because the security filter blocks unauthenticated contexts.
   - Query `/api/v1/providers/profile` passing headers `X-User-Id: 1000` and `X-User-Roles: RESPONDER`. Verify it successfully resolves context and returns profile info.
2. **Business Rule Integration**:
   - Verify that updating availability state to `AVAILABLE` updates the `PROVIDER_AVAILABILITY` table with the new state.

---

## 3. Postman Collection Examples

You can import this JSON collection directly into Postman.

```json
{
  "info": {
    "name": "NexFuel Provider Service API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Get Profile",
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
            "value": "RESPONDER",
            "type": "text"
          }
        ],
        "url": {
          "raw": "http://localhost:8083/api/v1/providers/profile",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8083",
          "path": ["api", "v1", "providers", "profile"]
        }
      }
    },
    {
      "name": "Upload Document",
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
            "value": "RESPONDER",
            "type": "text"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"docType\": \"CDL\",\n  \"docName\": \"Commercial Driver License\",\n  \"fileUrl\": \"http://storage.nexfuel.internal/docs/cdl_1000.pdf\",\n  \"expiresAt\": \"2030-12-31\"\n}",
          "options": {
            "raw": {
              "language": "json"
            }
          }
        },
        "url": {
          "raw": "http://localhost:8083/api/v1/providers/documents",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8083",
          "path": ["api", "v1", "providers", "documents"]
        }
      }
    },
    {
      "name": "List Documents",
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
            "value": "RESPONDER",
            "type": "text"
          }
        ],
        "url": {
          "raw": "http://localhost:8083/api/v1/providers/documents",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8083",
          "path": ["api", "v1", "providers", "documents"]
        }
      }
    },
    {
      "name": "Update Availability (Expect 403 if PENDING)",
      "request": {
        "method": "PUT",
        "header": [
          {
            "key": "X-User-Id",
            "value": "1000",
            "type": "text"
          },
          {
            "key": "X-User-Roles",
            "value": "RESPONDER",
            "type": "text"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"status\": \"AVAILABLE\"\n}",
          "options": {
            "raw": {
              "language": "json"
            }
          }
        },
        "url": {
          "raw": "http://localhost:8083/api/v1/providers/availability",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8083",
          "path": ["api", "v1", "providers", "availability"]
        }
      }
    },
    {
      "name": "Get Current Availability",
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
            "value": "RESPONDER",
            "type": "text"
          }
        ],
        "url": {
          "raw": "http://localhost:8083/api/v1/providers/availability",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8083",
          "path": ["api", "v1", "providers", "availability"]
        }
      }
    },
    {
      "name": "Get Dashboard Data",
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
            "value": "RESPONDER",
            "type": "text"
          }
        ],
        "url": {
          "raw": "http://localhost:8083/api/v1/providers/dashboard",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8083",
          "path": ["api", "v1", "providers", "dashboard"]
        }
      }
    },
    {
      "name": "Get Earnings Ledger",
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
            "value": "RESPONDER",
            "type": "text"
          }
        ],
        "url": {
          "raw": "http://localhost:8083/api/v1/providers/earnings",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8083",
          "path": ["api", "v1", "providers", "earnings"]
        }
      }
    }
  ]
}
```
