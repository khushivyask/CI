package com.ecommerce.userservice.service;

import com.ecommerce.userservice.model.ProductDTO;
import com.ecommerce.userservice.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class UserProductService {

    private final RestTemplate   restTemplate;
    private final UserRepository userRepository;

    // Docker: resolves by container name
    // Kubernetes: resolves by K8s Service DNS name
    @Value("${product.service.url:http://product-service:8082}")
    private String productServiceUrl;

    public UserProductService(RestTemplate restTemplate,
                              UserRepository userRepository) {
        this.restTemplate   = restTemplate;
        this.userRepository = userRepository;
    }

    public ProductDTO addProductForUser(Long userId, ProductDTO product) {

        // check user exists first
        if (!userRepository.existsById(userId)) {
            throw new RuntimeException("User not found: " + userId);
        }

        // user-service → HTTP POST → product-service
        String url = productServiceUrl
                     + "/api/products/create-for-user/" + userId;

        ResponseEntity<ProductDTO> response = restTemplate.postForEntity(
                url, product, ProductDTO.class);

        return response.getBody();
    }
}