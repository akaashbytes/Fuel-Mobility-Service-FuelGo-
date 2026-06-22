package com.nexfuel.order.service;

import com.nexfuel.order.dto.ServicePackageResponse;
import com.nexfuel.order.entity.ServicePackageEntity;
import com.nexfuel.order.repository.ServicePackageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ServicePackageService {

    private final ServicePackageRepository servicePackageRepository;

    @Transactional(readOnly = true)
    public List<ServicePackageResponse> getActivePackages() {
        return servicePackageRepository.findByStatus("ACTIVE").stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public ServicePackageResponse createPackage(ServicePackageEntity entity) {
        ServicePackageEntity saved = servicePackageRepository.save(entity);
        return mapToResponse(saved);
    }

    public ServicePackageResponse mapToResponse(ServicePackageEntity entity) {
        return new ServicePackageResponse(
                entity.getId(),
                entity.getName(),
                entity.getDescription(),
                entity.getPrice(),
                entity.getStatus()
        );
    }
}
