package com.nexfuel.provider.entity;

import com.nexfuel.shared.model.AuditModel;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "PROVIDER_DOCUMENTS")
@Getter
@Setter
@NoArgsConstructor
public class ProviderDocumentEntity extends AuditModel {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_prov_docs")
    @SequenceGenerator(name = "seq_prov_docs", sequenceName = "SEQ_PROVIDER_DOCUMENTS", allocationSize = 1)
    private Long id;

    @NotNull(message = "Provider profile is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "PROVIDER_ID", nullable = false)
    private ProviderProfileEntity providerProfile;

    @NotBlank(message = "Document type is required")
    @Size(max = 50, message = "Document type cannot exceed 50 characters")
    @Column(name = "DOC_TYPE", nullable = false, length = 50)
    private String docType;

    @NotBlank(message = "Document name is required")
    @Size(max = 100, message = "Document name cannot exceed 100 characters")
    @Column(name = "DOC_NAME", nullable = false, length = 100)
    private String docName;

    @NotBlank(message = "File URL is required")
    @Size(max = 500, message = "File URL cannot exceed 500 characters")
    @Column(name = "FILE_URL", nullable = false, length = 500)
    private String fileUrl;

    @NotNull(message = "Document status is required")
    @Enumerated(EnumType.STRING)
    @Column(name = "STATUS", nullable = false, length = 20)
    private DocumentStatus status = DocumentStatus.PENDING;

    @NotNull(message = "Expiration date is required")
    @Column(name = "EXPIRES_AT", nullable = false)
    private LocalDate expiresAt;
}
