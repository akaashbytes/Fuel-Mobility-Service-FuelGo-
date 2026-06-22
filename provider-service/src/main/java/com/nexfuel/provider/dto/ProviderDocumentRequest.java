package com.nexfuel.provider.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import java.time.LocalDate;

@Data
public class ProviderDocumentRequest {
    @NotBlank(message = "Document type is required")
    @Size(max = 50, message = "Document type cannot exceed 50 characters")
    private String docType;

    @NotBlank(message = "Document name is required")
    @Size(max = 100, message = "Document name cannot exceed 100 characters")
    private String docName;

    @NotBlank(message = "File URL is required")
    @Size(max = 500, message = "File URL cannot exceed 500 characters")
    private String fileUrl;

    @NotNull(message = "Expiration date is required")
    @Future(message = "Expiration date must be in the future")
    private LocalDate expiresAt;
}
