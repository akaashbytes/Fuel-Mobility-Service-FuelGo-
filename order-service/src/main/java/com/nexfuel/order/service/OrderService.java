package com.nexfuel.order.service;

import com.nexfuel.order.dto.*;
import com.nexfuel.order.entity.*;
import com.nexfuel.order.exception.*;
import com.nexfuel.order.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderAssignmentRepository orderAssignmentRepository;
    private final OrderStatusHistoryRepository orderStatusHistoryRepository;
    private final OrderOtpVerificationRepository orderOtpVerificationRepository;

    @Transactional
    public OrderResponse createOrder(Long customerId, CreateOrderRequest request) {
        OrderEntity order = new OrderEntity();
        order.setCustomerId(customerId);
        order.setVehicleId(request.getVehicleId());
        order.setFuelType(request.getFuelType());
        order.setQuantityGallons(request.getQuantityGallons());

        // Calculations (Defaults)
        BigDecimal fuelRate = new BigDecimal("3.50");
        BigDecimal deliveryRate = new BigDecimal("5.00");
        BigDecimal fuelCost = request.getQuantityGallons().multiply(fuelRate);
        BigDecimal total = fuelCost.add(deliveryRate);

        order.setDeliveryCharge(deliveryRate);
        order.setFuelCost(fuelCost);
        order.setTotalAmount(total);
        order.setTargetLatitude(request.getTargetLatitude());
        order.setTargetLongitude(request.getTargetLongitude());
        order.setTargetAddress(request.getTargetAddress());
        order.setStatus(OrderState.PENDING);

        OrderEntity saved = orderRepository.save(order);
        logStatusChange(saved, OrderState.PENDING, "CUSTOMER", "Order request created");

        return mapToResponse(saved);
    }

    @Transactional(readOnly = true)
    public OrderResponse getOrderById(Long id) {
        OrderEntity order = orderRepository.findById(id)
                .orElseThrow(() -> new OrderNotFoundException("Order not found with ID: " + id));
        return mapToResponse(order);
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> getOrdersByCustomer(Long customerId) {
        return orderRepository.findByCustomerId(customerId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> getAllOrders() {
        return orderRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public OrderResponse updateStatus(Long orderId, OrderStatusUpdateRequest request) {
        OrderEntity order = orderRepository.findById(orderId)
                .orElseThrow(() -> new OrderNotFoundException("Order not found with ID: " + orderId));

        OrderState currentStatus = order.getStatus();
        OrderState targetStatus = request.getStatus();

        // Rule 1: Cancelled orders cannot be modified
        if (currentStatus == OrderState.CANCELLED) {
            throw new OrderStateException("Cannot modify status. Order is already CANCELLED.");
        }

        // Rule 2: Completed orders cannot be modified
        if (currentStatus == OrderState.COMPLETED) {
            throw new OrderStateException("Cannot modify status. Order is already COMPLETED.");
        }

        // Rule 3: Cancellation from any non-terminal state
        if (targetStatus == OrderState.CANCELLED) {
            order.setStatus(OrderState.CANCELLED);
        } else {
            // Rule 4: Validation - Forward progression only
            if (targetStatus.ordinal() <= currentStatus.ordinal()) {
                throw new OrderStateException("Invalid transition. Status cannot move backwards from " + currentStatus + " to " + targetStatus);
            }

            // Rule 5: Cannot complete order without OTP verification
            if (targetStatus == OrderState.COMPLETED && currentStatus != OrderState.OTP_VERIFIED) {
                throw new OrderStateException("Cannot transition directly to COMPLETED. OTP verification is required.");
            }

            order.setStatus(targetStatus);
        }

        OrderEntity updated = orderRepository.save(order);
        logStatusChange(updated, targetStatus, request.getChangedBy(), request.getNotes());

        // Generate OTP when status transitions to FUEL_DELIVERED
        if (targetStatus == OrderState.FUEL_DELIVERED) {
            generateDeliveryOtp(updated);
        }

        return mapToResponse(updated);
    }

    @Transactional
    public OrderResponse assignProvider(Long orderId, Long providerId) {
        OrderEntity order = orderRepository.findById(orderId)
                .orElseThrow(() -> new OrderNotFoundException("Order not found with ID: " + orderId));

        if (order.getStatus() != OrderState.PENDING && order.getStatus() != OrderState.ASSIGNED) {
            throw new OrderStateException("Cannot assign provider. Order status is " + order.getStatus() + " and must be PENDING.");
        }

        order.setProviderId(providerId);
        order.setStatus(OrderState.ASSIGNED);
        OrderEntity saved = orderRepository.save(order);

        // Log assignment
        OrderAssignmentEntity assignment = new OrderAssignmentEntity();
        assignment.setOrder(saved);
        assignment.setProviderId(providerId);
        assignment.setStatus(AssignmentStatus.PENDING);
        assignment.setAssignedAt(LocalDateTime.now());
        orderAssignmentRepository.save(assignment);

        logStatusChange(saved, OrderState.ASSIGNED, "SYSTEM", "Provider ID " + providerId + " assigned to order.");

        return mapToResponse(saved);
    }

    @Transactional
    public OrderResponse verifyOtp(Long orderId, String otpCode) {
        OrderEntity order = orderRepository.findById(orderId)
                .orElseThrow(() -> new OrderNotFoundException("Order not found with ID: " + orderId));

        if (order.getStatus() != OrderState.FUEL_DELIVERED) {
            throw new OrderStateException("Cannot verify OTP. Order state must be FUEL_DELIVERED.");
        }

        OrderOtpVerificationEntity verification = orderOtpVerificationRepository.findByOrderId(orderId)
                .orElseThrow(() -> new OtpVerificationException("No OTP registration found for order ID: " + orderId));

        if (verification.getStatus() != OtpStatus.PENDING) {
            throw new OtpVerificationException("OTP has already been verified or expired.");
        }

        if (verification.getExpiredAt().isBefore(LocalDateTime.now())) {
            verification.setStatus(OtpStatus.EXPIRED);
            orderOtpVerificationRepository.save(verification);
            throw new OtpVerificationException("OTP has expired.");
        }

        if (!verification.getOtpCode().equals(otpCode)) {
            throw new OtpVerificationException("Invalid OTP code supplied.");
        }

        // Mark OTP verified
        verification.setStatus(OtpStatus.VERIFIED);
        orderOtpVerificationRepository.save(verification);

        // Shift order state to OTP_VERIFIED
        order.setStatus(OrderState.OTP_VERIFIED);
        OrderEntity saved = orderRepository.save(order);
        logStatusChange(saved, OrderState.OTP_VERIFIED, "SYSTEM", "Delivery OTP verified successfully.");

        // Automatically complete the order
        saved.setStatus(OrderState.COMPLETED);
        OrderEntity completed = orderRepository.save(saved);
        logStatusChange(completed, OrderState.COMPLETED, "SYSTEM", "Order completed successfully.");

        return mapToResponse(completed);
    }

    private void generateDeliveryOtp(OrderEntity order) {
        // Clear any old verification
        orderOtpVerificationRepository.findByOrderId(order.getId())
                .ifPresent(orderOtpVerificationRepository::delete);

        String code = String.format("%06d", new Random().nextInt(999999));

        OrderOtpVerificationEntity verification = new OrderOtpVerificationEntity();
        verification.setOrder(order);
        verification.setOtpCode(code);
        verification.setStatus(OtpStatus.PENDING);
        verification.setExpiredAt(LocalDateTime.now().plusMinutes(30));
        orderOtpVerificationRepository.save(verification);

        // In production, this would trigger SMS or Email notification to the Customer.
        // For local development, we print the OTP to standard output/logs.
        System.out.println(">>> NexFuel Delivery Verification OTP for Order #" + order.getId() + " is: " + code);
    }

    private void logStatusChange(OrderEntity order, OrderState status, String changedBy, String notes) {
        OrderStatusHistoryEntity history = new OrderStatusHistoryEntity();
        history.setOrder(order);
        history.setStatus(status);
        history.setChangedBy(changedBy);
        history.setNotes(notes);
        orderStatusHistoryRepository.save(history);
    }

    public OrderResponse mapToResponse(OrderEntity entity) {
        return new OrderResponse(
                entity.getId(),
                entity.getCustomerId(),
                entity.getVehicleId(),
                entity.getProviderId(),
                entity.getStatus(),
                entity.getFuelType(),
                entity.getQuantityGallons(),
                entity.getDeliveryCharge(),
                entity.getFuelCost(),
                entity.getTotalAmount(),
                entity.getTargetLatitude(),
                entity.getTargetLongitude(),
                entity.getTargetAddress(),
                entity.getCreatedAt()
        );
    }
}
