package com.ecommerce.gateway.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/fallback")
public class FallbackController {

    @GetMapping("/users")
    public ResponseEntity<Map<String, String>> userFallback() {
        return ResponseEntity.status(503)
                .body(Map.of("error", "User service is temporarily unavailable."));
    }

    @GetMapping("/products")
    public ResponseEntity<Map<String, String>> productFallback() {
        return ResponseEntity.status(503)
                .body(Map.of("error", "Product service is temporarily unavailable."));
    }
}