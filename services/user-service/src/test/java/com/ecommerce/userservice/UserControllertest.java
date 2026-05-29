package com.ecommerce.userservice.controller;

import com.ecommerce.userservice.model.User;
import com.ecommerce.userservice.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class UserControllerTest {

    @Autowired MockMvc mockMvc;
    @Autowired UserRepository userRepository;
    @Autowired ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();
    }

    @Test
    void healthCheck_returns200() throws Exception {
        mockMvc.perform(get("/api/users/health"))
               .andExpect(status().isOk())
               .andExpect(jsonPath("$.status").value("ok"))
               .andExpect(jsonPath("$.service").value("user-service"));
    }

    @Test
    void createUser_validPayload_returns201() throws Exception {
        User user = new User("Alice", "alice@example.com", "USER");
        mockMvc.perform(post("/api/users")
                       .contentType(MediaType.APPLICATION_JSON)
                       .content(objectMapper.writeValueAsString(user)))
               .andExpect(status().isCreated())
               .andExpect(jsonPath("$.name").value("Alice"))
               .andExpect(jsonPath("$.email").value("alice@example.com"));
    }

    @Test
    void createUser_duplicateEmail_returns400() throws Exception {
        userRepository.save(new User("Alice", "alice@example.com", "USER"));
        User duplicate = new User("Alice2", "alice@example.com", "USER");
        mockMvc.perform(post("/api/users")
                       .contentType(MediaType.APPLICATION_JSON)
                       .content(objectMapper.writeValueAsString(duplicate)))
               .andExpect(status().isBadRequest());
    }

    @Test
    void getUserById_notFound_returns404() throws Exception {
        mockMvc.perform(get("/api/users/999"))
               .andExpect(status().isNotFound());
    }

    @Test
    void getAllUsers_returnsListOf2() throws Exception {
        userRepository.save(new User("Alice", "alice@example.com", "USER"));
        userRepository.save(new User("Bob", "bob@example.com", "ADMIN"));
        mockMvc.perform(get("/api/users"))
               .andExpect(status().isOk())
               .andExpect(jsonPath("$.length()").value(2));
    }

    @Test
    void deleteUser_existing_returns204() throws Exception {
        User saved = userRepository.save(new User("Alice", "alice@example.com", "USER"));
        mockMvc.perform(delete("/api/users/" + saved.getId()))
               .andExpect(status().isNoContent());
    }
}