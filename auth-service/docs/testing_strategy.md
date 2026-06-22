# NexFuel Authentication Service Testing & Collection Strategy

This document outlines the testing methodologies (Unit & Integration) and provides standard JSON collection formats for Postman API validations.

---

## 1. Unit Testing Strategy

Unit tests are written using **JUnit 5** and **Mockito** to test business logic in isolation by mocking repository layers and external configurations.

### Target Areas & Mock Bindings:
- **`AuthServiceTest`**:
  - Mock `UserRepository`, `RoleRepository`, `RefreshTokenRepository`, `PasswordEncoder`, `JwtTokenProvider`, and `OtpService`.
  - Validate registration logic (throws error if email/phone exists; encrypts passwords via BCrypt).
  - Validate login checks (fails on wrong credentials, accounts that are `INACTIVE` or `SUSPENDED`).
  - Validate token rotation safety (checks expiration, invalidates old UUID tokens, returns new access/refresh credentials).
- **`OtpServiceTest`**:
  - Mock `OtpVerificationRepository`, `OtpGenerator`, and `OtpValidator`.
  - Test OTP generation (correctly hashes OTP using SHA-256 before storage).
  - Test OTP validation checks (locks accounts/invalidates codes on 3 consecutive invalid attempts; throws errors on expired records).

### Example Unit Test Skeleton (`AuthServiceTest.java`)
```java
@ExtendWith(MockitoExtension.class)
class AuthServiceTest {
    @Mock private UserRepository userRepository;
    @Mock private PasswordEncoder passwordEncoder;
    @InjectMocks private AuthService authService;

    @Test
    void register_ShouldThrowException_WhenEmailAlreadyExists() {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("duplicate@nexfuel.com");
        
        when(userRepository.existsByEmail(request.getEmail())).thenReturn(true);
        
        assertThrows(BaseException.class, () -> authService.register(request));
    }
}
```

---

## 2. Integration Testing Strategy

Integration tests load the full Spring context (`@SpringBootTest`) using an in-memory database (e.g. H2 in Oracle Mode) or **Testcontainers** running a lightweight Oracle XE container.

### Core Mappings to Verify:
1. **Security Filters Validation**:
   - Query `/api/v1/auth/profile` without credentials. Verify it returns `401 Unauthorized`.
   - Query `/api/v1/auth/profile` with an expired JWT access token. Verify it returns `401 Unauthorized` with `INVALID_TOKEN` error code.
2. **Transaction Clears**:
   - Verify registration database commits. Ensure user record status is written as `INACTIVE` and a hashed OTP record is committed to `OTP_VERIFICATIONS`.
3. **Cookie Writing**:
   - Send login request. Verify that `Set-Cookie` header contains `refreshToken` with `HttpOnly`, `SameSite=Lax`, and valid path parameters.

---

## 3. Postman Collection Examples

You can import this raw JSON directly into Postman to test the authentication flow.

```json
{
  "info": {
    "name": "NexFuel Auth Service API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Register User",
      "request": {
        "method": "POST",
        "header": [],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"fullName\": \"Jane Doe\",\n  \"email\": \"jane.doe@nexfuel.com\",\n  \"password\": \"Password123!\",\n  \"phoneNumber\": \"+919876543210\",\n  \"role\": \"CUSTOMER\"\n}",
          "options": {
            "raw": {
              "language": "json"
            }
          }
        },
        "url": {
          "raw": "http://localhost:8080/api/v1/auth/register",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8080",
          "path": ["api", "v1", "auth", "register"]
        }
      }
    },
    {
      "name": "Verify OTP",
      "request": {
        "method": "POST",
        "header": [],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"email\": \"jane.doe@nexfuel.com\",\n  \"otpCode\": \"123456\",\n  \"verifyType\": \"EMAIL_SIGNUP\"\n}",
          "options": {
            "raw": {
              "language": "json"
            }
          }
        },
        "url": {
          "raw": "http://localhost:8080/api/v1/auth/verify-otp",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8080",
          "path": ["api", "v1", "auth", "verify-otp"]
        }
      }
    },
    {
      "name": "Login User",
      "request": {
        "method": "POST",
        "header": [],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"email\": \"jane.doe@nexfuel.com\",\n  \"password\": \"Password123!\"\n}",
          "options": {
            "raw": {
              "language": "json"
            }
          }
        },
        "url": {
          "raw": "http://localhost:8080/api/v1/auth/login",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8080",
          "path": ["api", "v1", "auth", "login"]
        }
      }
    },
    {
      "name": "Refresh Token",
      "request": {
        "method": "POST",
        "header": [],
        "url": {
          "raw": "http://localhost:8080/api/v1/auth/refresh",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8080",
          "path": ["api", "v1", "auth", "refresh"]
        }
      }
    },
    {
      "name": "Get Profile",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{accessToken}}",
            "type": "text"
          }
        ],
        "url": {
          "raw": "http://localhost:8080/api/v1/auth/profile",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8080",
          "path": ["api", "v1", "auth", "profile"]
        }
      }
    },
    {
      "name": "Logout",
      "request": {
        "method": "POST",
        "header": [],
        "url": {
          "raw": "http://localhost:8080/api/v1/auth/logout",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8080",
          "path": ["api", "v1", "auth", "logout"]
        }
      }
    }
  ]
}
```
