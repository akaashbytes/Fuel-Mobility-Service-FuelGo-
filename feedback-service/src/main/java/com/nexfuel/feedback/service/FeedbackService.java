package com.nexfuel.feedback.service;

import com.nexfuel.feedback.dto.FeedbackDetailResponse;
import com.nexfuel.feedback.dto.FeedbackRequest;
import com.nexfuel.feedback.dto.FeedbackResponse;
import com.nexfuel.feedback.dto.FeedbackResponseDto;
import com.nexfuel.feedback.entity.FeedbackEntity;
import com.nexfuel.feedback.exception.DuplicateFeedbackException;
import com.nexfuel.feedback.exception.FeedbackNotFoundException;
import com.nexfuel.feedback.exception.InvalidOrderFeedbackException;
import com.nexfuel.feedback.exception.UnauthorizedFeedbackAccessException;
import com.nexfuel.feedback.repository.FeedbackRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FeedbackService {

    private final FeedbackRepository feedbackRepository;

    @Transactional
    public FeedbackResponse submitFeedback(Long customerId, FeedbackRequest request) {
        // Business Rule: One feedback per order
        if (feedbackRepository.existsByOrderId(request.getOrderId())) {
            throw new DuplicateFeedbackException("Feedback already exists for order ID: " + request.getOrderId());
        }

        // Mock Order Status & Ownership Validation
        // In a real application, you would make an IPC call via RestTemplate/Feign to order-service
        // Here we simulate the logic:
        validateOrderCompletionAndOwnership(request.getOrderId(), customerId);

        // Assume order was completed by provider ID 101L (mock mapping)
        Long providerId = 101L; 

        FeedbackEntity feedback = new FeedbackEntity();
        feedback.setOrderId(request.getOrderId());
        feedback.setCustomerId(customerId);
        feedback.setProviderId(providerId);
        feedback.setRating(request.getRating());
        feedback.setComment(request.getComment());

        FeedbackEntity saved = feedbackRepository.save(feedback);
        return mapToResponse(saved);
    }

    public FeedbackDetailResponse getFeedbackById(Long id) {
        FeedbackEntity feedback = feedbackRepository.findById(id)
                .orElseThrow(() -> new FeedbackNotFoundException("Feedback not found with ID: " + id));
        return mapToDetailResponse(feedback);
    }

    public List<FeedbackResponse> getFeedbackByProvider(Long providerId) {
        return feedbackRepository.findByProviderId(providerId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<FeedbackResponse> getFeedbackByCustomer(Long customerId) {
        return feedbackRepository.findByCustomerId(customerId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private void validateOrderCompletionAndOwnership(Long orderId, Long customerId) {
        // Mock Validation Rules:
        // 1. If orderId is even, it's owned by this customer and completed.
        // 2. If orderId is odd, mock a validation failure to demonstrate exception handling.
        if (orderId % 2 != 0) {
            if (orderId == 999) {
                throw new UnauthorizedFeedbackAccessException("You are not authorized to submit feedback for this order.");
            }
            throw new InvalidOrderFeedbackException("Only completed orders can receive feedback.");
        }
    }

    public FeedbackResponse mapToResponse(FeedbackEntity entity) {
        return FeedbackResponse.builder()
                .id(entity.getId())
                .orderId(entity.getOrderId())
                .customerId(entity.getCustomerId())
                .providerId(entity.getProviderId())
                .rating(entity.getRating())
                .comment(entity.getComment())
                .createdAt(entity.getCreatedAt())
                .build();
    }

    public FeedbackDetailResponse mapToDetailResponse(FeedbackEntity entity) {
        List<FeedbackResponseDto> responseDtos = entity.getResponses().stream()
                .map(res -> FeedbackResponseDto.builder()
                        .id(res.getId())
                        .adminId(res.getAdminId())
                        .responseComment(res.getResponseComment())
                        .createdAt(res.getCreatedAt())
                        .build())
                .collect(Collectors.toList());

        return FeedbackDetailResponse.builder()
                .id(entity.getId())
                .orderId(entity.getOrderId())
                .customerId(entity.getCustomerId())
                .providerId(entity.getProviderId())
                .rating(entity.getRating())
                .comment(entity.getComment())
                .responses(responseDtos)
                .createdAt(entity.getCreatedAt())
                .build();
    }
}
