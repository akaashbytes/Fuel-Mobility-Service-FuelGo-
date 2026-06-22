package com.nexfuel.feedback.service;

import com.nexfuel.feedback.dto.FeedbackDetailResponse;
import com.nexfuel.feedback.entity.FeedbackEntity;
import com.nexfuel.feedback.entity.FeedbackResponseEntity;
import com.nexfuel.feedback.exception.FeedbackNotFoundException;
import com.nexfuel.feedback.repository.FeedbackRepository;
import com.nexfuel.feedback.repository.FeedbackResponseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class FeedbackResponseService {

    private final FeedbackRepository feedbackRepository;
    private final FeedbackResponseRepository responseRepository;
    private final FeedbackService feedbackService;

    @Transactional
    public FeedbackDetailResponse addAdminResponse(Long adminId, Long feedbackId, String responseComment) {
        FeedbackEntity feedback = feedbackRepository.findById(feedbackId)
                .orElseThrow(() -> new FeedbackNotFoundException("Feedback not found with ID: " + feedbackId));

        FeedbackResponseEntity response = new FeedbackResponseEntity();
        response.setAdminId(adminId);
        response.setResponseComment(responseComment);
        
        feedback.addResponse(response);
        responseRepository.save(response);

        return feedbackService.mapToDetailResponse(feedback);
    }
}
