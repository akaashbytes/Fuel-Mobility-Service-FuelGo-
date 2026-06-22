package com.nexfuel.order.service;

import com.nexfuel.order.entity.AssignmentStatus;
import com.nexfuel.order.entity.OrderAssignmentEntity;
import com.nexfuel.order.repository.OrderAssignmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderAssignmentService {
    private final OrderAssignmentRepository orderAssignmentRepository;

    @Transactional(readOnly = true)
    public List<OrderAssignmentEntity> getAssignmentsByProvider(Long providerId) {
        return orderAssignmentRepository.findByProviderIdAndStatus(providerId, AssignmentStatus.PENDING);
    }
}
