package com.nexfuel.provider.dto;

import com.nexfuel.provider.entity.DocumentStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProviderDocumentResponse {
    private Long id;
    private Long providerId;
    private String docType;
    private String docName;
    private String fileUrl;
    private DocumentStatus status;
    private LocalDate expiresAt;
}
