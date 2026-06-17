package com.ecommerce.userservice.controller;

import com.ecommerce.userservice.model.ProductDTO;
import com.ecommerce.userservice.service.UserProductService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users/{userId}/products")
@CrossOrigin(origins = "*")
public class UserProductController {

    private final UserProductService userProductService;

    public UserProductController(UserProductService userProductService) {
        this.userProductService = userProductService;
    }

    // POST /api/users/1/products
    // user-service receives → calls product-service → product saved
    @PostMapping
    public ResponseEntity<ProductDTO> addProduct(
            @PathVariable Long userId,
            @RequestBody ProductDTO product) {
        ProductDTO created = userProductService.addProductForUser(userId, product);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
}