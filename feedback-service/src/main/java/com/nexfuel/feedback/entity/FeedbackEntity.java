package com.nexfuel.feedback.entity;

import com.nexfuel.shared.model.AuditModel;
import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "FEEDBACK")
public class FeedbackEntity extends AuditModel {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "feedback_gen")
    @SequenceGenerator(name = "feedback_gen", sequenceName = "feedback_seq", allocationSize = 1)
    private Long id;

    @NotNull
    @Column(name = "order_id", nullable = false, unique = true)
    private Long orderId;

    @NotNull
    @Column(name = "customer_id", nullable = false)
    private Long customerId;

    @NotNull
    @Column(name = "provider_id", nullable = false)
    private Long providerId;

    @NotNull
    @Min(1)
    @Max(5)
    @Column(name = "rating", nullable = false)
    private Integer rating;

    @Size(max = 500)
    @Column(name = "comment", length = 500)
    private String comment;

    @OneToMany(mappedBy = "feedback", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<FeedbackResponseEntity> responses = new ArrayList<>();

    public void addResponse(FeedbackResponseEntity response) {
        responses.add(response);
        response.setFeedback(this);
    }
}
