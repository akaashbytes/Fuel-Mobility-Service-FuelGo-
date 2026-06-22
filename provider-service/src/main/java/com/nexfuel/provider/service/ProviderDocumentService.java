package com.nexfuel.provider.service;

import com.nexfuel.provider.dto.ProviderDocumentRequest;
import com.nexfuel.provider.dto.ProviderDocumentResponse;
import com.nexfuel.provider.entity.DocumentStatus;
import com.nexfuel.provider.entity.ProviderDocumentEntity;
import com.nexfuel.provider.entity.ProviderProfileEntity;
import com.nexfuel.provider.exception.ProviderNotFoundException;
import com.nexfuel.provider.repository.ProviderDocumentRepository;
import com.nexfuel.provider.repository.ProviderProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProviderDocumentService {

    private final ProviderDocumentRepository providerDocumentRepository;
    private final ProviderProfileRepository providerProfileRepository;

    @Transactional
    public ProviderDocumentResponse uploadDocument(Long userId, ProviderDocumentRequest request) {
        ProviderProfileEntity profile = providerProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ProviderNotFoundException("Provider profile not found for user: " + userId));

        ProviderDocumentEntity document = new ProviderDocumentEntity();
        document.setProviderProfile(profile);
        document.setDocType(request.getDocType());
        document.setDocName(request.getDocName());
        document.setFileUrl(request.getFileUrl());
        document.setStatus(DocumentStatus.PENDING);
        document.setExpiresAt(request.getExpiresAt());

        ProviderDocumentEntity saved = providerDocumentRepository.save(document);
        return mapToResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<ProviderDocumentResponse> getDocumentsByUserId(Long userId) {
        ProviderProfileEntity profile = providerProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ProviderNotFoundException("Provider profile not found for user: " + userId));

        return providerDocumentRepository.findByProviderProfileId(profile.getId())
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public ProviderDocumentResponse mapToResponse(ProviderDocumentEntity entity) {
        return new ProviderDocumentResponse(
                entity.getId(),
                entity.getProviderProfile().getId(),
                entity.getDocType(),
                entity.getDocName(),
                entity.getFileUrl(),
                entity.getStatus(),
                entity.getExpiresAt()
        );
    }
}
