# NexFuel Customer Service Testing & Collection Strategy

This document outlines the testing methodologies (Unit & Integration) and provides standard JSON collection formats for Postman API validations.

---

## 1. Unit Testing Strategy

Unit tests are written using **JUnit 5** and **Mockito** to test customer profile and vehicle logic in isolation by mocking database repository operations.

### Target Areas & Mock Bindings:
- **`CustomerProfileServiceTest`**:
  - Mock `CustomerProfileRepository`.
  - Validate profile lookup (auto-creates a profile record on first fetch if it does not exist).
  - Validate profile updates (modifies delivery address parameters).
- **`VehicleServiceTest`**:
  - Mock `VehicleRepository` and `CustomerProfileRepository`.
  - Validate add vehicle (throws `BaseException` if license plate already exists in DB).
  - Validate update/delete ownership checks:
    - Verify that trying to update or delete a vehicle record belonging to *another* customer profile (checked by matching the user ID) throws `UnauthorizedVehicleAccessException`.
    - Verify successful update/delete when user IDs match.

### Example Unit Test Skeleton (`VehicleServiceTest.java`)
```java
@ExtendWith(MockitoExtension.class)
class VehicleServiceTest {
    @Mock private VehicleRepository vehicleRepository;
    @Mock private CustomerProfileRepository customerProfileRepository;
    @InjectMocks private VehicleService vehicleService;

    @Test
    void updateVehicle_ShouldThrowException_WhenUserDoesNotOwnVehicle() {
        Long authenticatedUserId = 1000L;
        Long otherUserId = 2000L;
        Long vehicleId = 50L;

        CustomerProfileEntity otherProfile = new CustomerProfileEntity();
        otherProfile.setUserId(otherUserId);

        VehicleEntity vehicle = new VehicleEntity();
        vehicle.setId(vehicleId);
        vehicle.setCustomerProfile(otherProfile);

        when(vehicleRepository.findById(vehicleId)).thenReturn(Optional.of(vehicle));

        assertThrows(UnauthorizedVehicleAccessException.class, () -> 
                vehicleService.updateVehicle(authenticatedUserId, vehicleId, new VehicleRequest())
        );
    }
}
```

---

## 2. Integration Testing Strategy

Integration tests load the Spring Boot servlet container using an in-memory database to verify API bindings and reactive authentication filter pipelines.

### Core Mappings to Verify:
1. **Header Security Context Resolution**:
   - Query `/api/v1/customers/profile` with no headers. Verify it returns `403 Forbidden` or `401 Unauthorized` because the security filter blocks unauthenticated contexts.
   - Query `/api/v1/customers/profile` passing headers `X-User-Id: 1000` and `X-User-Roles: ROLE_CUSTOMER`. Verify it successfully resolves context and returns profile info.
2. **Database Integration**:
   - Verify that adding a vehicle saves records in the `VEHICLES` table with the proper foreign key relation to the customer profile.

---

## 3. Postman Collection Examples

You can import this JSON collection directly into Postman.

```json
{
  "info": {
    "name": "NexFuel Customer Service API",
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
            "value": "ROLE_CUSTOMER",
            "type": "text"
          }
        ],
        "url": {
          "raw": "http://localhost:8082/api/v1/customers/profile",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8082",
          "path": ["api", "v1", "customers", "profile"]
        }
      }
    },
    {
      "name": "Update Profile Address",
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
            "value": "ROLE_CUSTOMER",
            "type": "text"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"defaultAddress\": \"Koramangala 4th block, Bangalore\"\n}",
          "options": {
            "raw": {
              "language": "json"
            }
          }
        },
        "url": {
          "raw": "http://localhost:8082/api/v1/customers/profile",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8082",
          "path": ["api", "v1", "customers", "profile"]
        }
      }
    },
    {
      "name": "Register Vehicle",
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
            "value": "ROLE_CUSTOMER",
            "type": "text"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"make\": \"Ford\",\n  \"model\": \"F-150\",\n  \"year\": 2024,\n  \"licensePlate\": \"KA-01-MJ-9999\",\n  \"fuelType\": \"91 Premium\"\n}",
          "options": {
            "raw": {
              "language": "json"
            }
          }
        },
        "url": {
          "raw": "http://localhost:8082/api/v1/customers/vehicles",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8082",
          "path": ["api", "v1", "customers", "vehicles"]
        }
      }
    },
    {
      "name": "List Registered Vehicles",
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
          "raw": "http://localhost:8082/api/v1/customers/vehicles",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8082",
          "path": ["api", "v1", "customers", "vehicles"]
        }
      }
    },
    {
      "name": "Update Vehicle Details",
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
            "value": "ROLE_CUSTOMER",
            "type": "text"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"make\": \"Ford\",\n  \"model\": \"F-150 (Raptor)\",\n  \"year\": 2025,\n  \"licensePlate\": \"KA-01-MJ-9999\",\n  \"fuelType\": \"91 Premium\"\n}",
          "options": {
            "raw": {
              "language": "json"
            }
          }
        },
        "url": {
          "raw": "http://localhost:8082/api/v1/customers/vehicles/100",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8082",
          "path": ["api", "v1", "customers", "vehicles", "100"]
        }
      }
    },
    {
      "name": "Get Dashboard data",
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
          "raw": "http://localhost:8082/api/v1/customers/dashboard",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8082",
          "path": ["api", "v1", "customers", "dashboard"]
        }
      }
    }
  ]
}
```
