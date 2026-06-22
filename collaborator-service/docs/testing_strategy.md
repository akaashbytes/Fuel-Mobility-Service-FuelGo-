# NexFuel Collaborator Service Testing & Collection Strategy

This document outlines the testing methodologies (Unit & Integration) and provides standard JSON collection formats for Postman API validations.

---

## 1. Unit Testing Strategy

Unit tests are written using **JUnit 5** and **Mockito** to test collaborator profile matching, fuel pricing rules, and service area boundary calculations.

### Target Areas & Mock Bindings:
- **`CollaboratorServiceTest`**:
  - Mock `CollaboratorRepository`, `ServiceAreaRepository`, and `CollaboratorServiceAreaRepository`.
  - Validate add collaborator:
    - Verify that adding a collaborator with a duplicate email throws `CollaboratorValidationException`.
    - Verify that adding a collaborator without associating at least one service area throws `CollaboratorValidationException`.
- **`FuelPricingServiceTest`**:
  - Mock `CollaboratorFuelPricingRepository` and `CollaboratorRepository`.
  - Validate status constraint:
    - Verify that trying to modify fuel pricing for a collaborator whose status is *not* `ACTIVE_PARTNER` (e.g. `PROSPECT`) throws `CollaboratorValidationException`.
  - Validate fuel types constraint:
    - Verify that adding a fuel price for an unsupported fuel type (e.g. "Hydrogen") throws `CollaboratorValidationException`.

### Example Unit Test Skeleton (`FuelPricingServiceTest.java`)
```java
package com.nexfuel.collaborator.service;

import com.nexfuel.collaborator.dto.CollaboratorFuelPricingRequest;
import com.nexfuel.collaborator.entity.CollaboratorEntity;
import com.nexfuel.collaborator.entity.CollaboratorStatus;
import com.nexfuel.collaborator.exception.CollaboratorValidationException;
import com.nexfuel.collaborator.repository.CollaboratorFuelPricingRepository;
import com.nexfuel.collaborator.repository.CollaboratorRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class FuelPricingServiceTest {

    @Mock
    private CollaboratorFuelPricingRepository collaboratorFuelPricingRepository;

    @Mock
    private CollaboratorRepository collaboratorRepository;

    @InjectMocks
    private FuelPricingService fuelPricingService;

    @Test
    void addOrUpdatePricing_ShouldThrowException_WhenCollaboratorNotActive() {
        Long collaboratorId = 1L;
        CollaboratorEntity collaborator = new CollaboratorEntity();
        collaborator.setId(collaboratorId);
        collaborator.setStatus(CollaboratorStatus.PROSPECT); // Not active partner

        when(collaboratorRepository.findById(collaboratorId)).thenReturn(Optional.of(collaborator));

        CollaboratorFuelPricingRequest request = new CollaboratorFuelPricingRequest();
        request.setFuelType("87 Regular");
        request.setPrice(new BigDecimal("3.49"));

        assertThrows(CollaboratorValidationException.class, () ->
                fuelPricingService.addOrUpdatePricing(collaboratorId, request)
        );
    }
}
```

---

## 2. Integration Testing Strategy

Integration tests load the Spring Boot servlet container using an in-memory database to verify API endpoints security bindings and context resolution.

### Core Mappings to Verify:
1. **Header Security Context Resolution**:
   - Query `/api/v1/collaborators` with no headers. Verify it returns `401 Unauthorized`.
   - Query `POST /api/v1/collaborators` passing header `X-User-Roles: ROLE_CUSTOMER`. Verify it returns `403 Forbidden` because only `ROLE_ADMIN` can write/edit collaborator data.
   - Query `POST /api/v1/collaborators` passing header `X-User-Roles: ROLE_ADMIN` and `X-User-Id: 1000`. Verify it successfully authorizes and processes the request.
2. **Haversine Distance Matching**:
   - Save two active collaborators with coordinates (e.g. Bunk A at `12.9716, 77.5946` and Bunk B at `13.0827, 80.2707`).
   - Query `/api/v1/collaborators/nearest?latitude=12.9500&longitude=77.6000`.
   - Verify that Bunk A is returned as the nearest match.

---

## 3. Postman Collection Examples

You can import this JSON collection directly into Postman.

```json
{
  "info": {
    "name": "NexFuel Collaborator Service API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Create Service Area (Admin)",
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
          "raw": "{\n  \"city\": \"Bangalore\",\n  \"name\": \"Indiranagar\",\n  \"status\": \"ACTIVE\",\n  \"polygonCoords\": \"{\\\"type\\\":\\\"Polygon\\\",\\\"coordinates\\\":[[[77.632,12.978],[77.645,12.978],[77.645,12.962],[77.632,12.962],[77.632,12.978]]]}\"\n}",
          "options": {
            "raw": {
              "language": "json"
            }
          }
        },
        "url": {
          "raw": "http://localhost:8084/api/v1/service-areas",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8084",
          "path": ["api", "v1", "service-areas"]
        }
      }
    },
    {
      "name": "Create Collaborator (Admin)",
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
          "raw": "{\n  \"name\": \"Hindustan Petroleum Station\",\n  \"contactPerson\": \"Ramesh Kumar\",\n  \"email\": \"hp.indiranagar@hpcl.co.in\",\n  \"phoneNumber\": \"+91-80-25201234\",\n  \"address\": \"100 Feet Rd, Indiranagar, Bangalore\",\n  \"status\": \"ACTIVE_PARTNER\",\n  \"contractExpiryDate\": \"2028-12-31\",\n  \"notes\": \"Premium refueling partner with underground reserves.\",\n  \"latitude\": 12.9716,\n  \"longitude\": 77.5946,\n  \"serviceAreaIds\": [1]\n}",
          "options": {
            "raw": {
              "language": "json"
            }
          }
        },
        "url": {
          "raw": "http://localhost:8084/api/v1/collaborators",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8084",
          "path": ["api", "v1", "collaborators"]
        }
      }
    },
    {
      "name": "Modify Collaborator Pricing (Admin)",
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
          "raw": "{\n  \"fuelType\": \"91 Premium\",\n  \"price\": 3.89\n}",
          "options": {
            "raw": {
              "language": "json"
            }
          }
        },
        "url": {
          "raw": "http://localhost:8084/api/v1/collaborators/10/pricing",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8084",
          "path": ["api", "v1", "collaborators", "10", "pricing"]
        }
      }
    },
    {
      "name": "List Collaborators",
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
            "value": "ROLE_CUSTOMER",
            "type": "text"
          }
        ],
        "url": {
          "raw": "http://localhost:8084/api/v1/collaborators",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8084",
          "path": ["api", "v1", "collaborators"]
        }
      }
    },
    {
      "name": "Find Nearest Bunk (Haversine)",
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
            "value": "ROLE_CUSTOMER",
            "type": "text"
          }
        ],
        "url": {
          "raw": "http://localhost:8084/api/v1/collaborators/nearest?latitude=12.9500&longitude=77.6000&fuelType=91 Premium",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8084",
          "path": ["api", "v1", "collaborators", "nearest"],
          "query": [
            {
              "key": "latitude",
              "value": "12.9500"
            },
            {
              "key": "longitude",
              "value": "77.6000"
            },
            {
              "key": "fuelType",
              "value": "91 Premium"
            }
          ]
        }
      }
    }
  ]
}
```
