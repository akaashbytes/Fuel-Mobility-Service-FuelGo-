package com.nexfuel.admin.config;

import com.nexfuel.shared.constant.SecurityConstants;
import feign.RequestInterceptor;
import feign.RequestTemplate;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Component
public class FeignClientInterceptor implements RequestInterceptor {

    @Override
    public void apply(RequestTemplate template) {
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (attributes != null) {
            HttpServletRequest request = attributes.getRequest();
            String userId = request.getHeader(SecurityConstants.HEADER_USER_ID);
            String email = request.getHeader(SecurityConstants.HEADER_USER_EMAIL);
            String roles = request.getHeader(SecurityConstants.HEADER_USER_ROLES);
            String permissions = request.getHeader(SecurityConstants.HEADER_USER_PERMISSIONS);

            if (userId != null) {
                template.header(SecurityConstants.HEADER_USER_ID, userId);
            }
            if (email != null) {
                template.header(SecurityConstants.HEADER_USER_EMAIL, email);
            }
            if (roles != null) {
                template.header(SecurityConstants.HEADER_USER_ROLES, roles);
            }
            if (permissions != null) {
                template.header(SecurityConstants.HEADER_USER_PERMISSIONS, permissions);
            }
        }
    }
}
