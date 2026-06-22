package com.nexfuel.collaborator.dto;

import com.nexfuel.collaborator.entity.ServiceAreaStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ServiceAreaResponse {
    private Long id;
    private String city;
    private String name;
    private ServiceAreaStatus status;
    private String polygonCoords;
}
