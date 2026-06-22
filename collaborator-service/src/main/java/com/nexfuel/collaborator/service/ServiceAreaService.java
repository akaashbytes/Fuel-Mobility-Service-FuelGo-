package com.nexfuel.collaborator.service;

import com.nexfuel.collaborator.dto.ServiceAreaRequest;
import com.nexfuel.collaborator.dto.ServiceAreaResponse;
import com.nexfuel.collaborator.entity.ServiceAreaEntity;
import com.nexfuel.collaborator.entity.ServiceAreaStatus;
import com.nexfuel.collaborator.exception.ServiceAreaNotFoundException;
import com.nexfuel.collaborator.repository.ServiceAreaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ServiceAreaService {

    private final ServiceAreaRepository serviceAreaRepository;

    @Transactional
    public ServiceAreaResponse createServiceArea(ServiceAreaRequest request) {
        ServiceAreaEntity area = new ServiceAreaEntity();
        area.setCity(request.getCity());
        area.setName(request.getName());
        area.setPolygonCoords(request.getPolygonCoords());
        if (request.getStatus() != null) {
            area.setStatus(request.getStatus());
        } else {
            area.setStatus(ServiceAreaStatus.ACTIVE);
        }

        ServiceAreaEntity saved = serviceAreaRepository.save(area);
        return mapToResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<ServiceAreaResponse> getAllServiceAreas() {
        return serviceAreaRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ServiceAreaResponse getServiceAreaById(Long id) {
        ServiceAreaEntity area = serviceAreaRepository.findById(id)
                .orElseThrow(() -> new ServiceAreaNotFoundException("Service area not found with id: " + id));
        return mapToResponse(area);
    }

    public ServiceAreaResponse mapToResponse(ServiceAreaEntity entity) {
        return new ServiceAreaResponse(
                entity.getId(),
                entity.getCity(),
                entity.getName(),
                entity.getStatus(),
                entity.getPolygonCoords()
        );
    }
}
