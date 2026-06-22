package com.nexfuel.feedback.entity;

import com.nexfuel.shared.model.AuditModel;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "FEEDBACK_RESPONSES")
public class FeedbackResponseEntity extends AuditModel {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "feedback_responses_gen")
    @SequenceGenerator(name = "feedback_responses_gen", sequenceName = "feedback_responses_seq", allocationSize = 1)
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "feedback_id", nullable = false)
    private FeedbackEntity feedback;

    @NotNull
    @Column(name = "admin_id", nullable = false)
    private Long adminId;

    @NotNull
    @Size(max = 500)
    @Column(name = "response_comment", nullable = false, length = 500)
    private String responseComment;
}
