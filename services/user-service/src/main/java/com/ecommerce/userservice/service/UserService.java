// package com.ecommerce.userservice.service;

// import com.ecommerce.userservice.model.User;
// import com.ecommerce.userservice.repository.UserRepository;
// import org.springframework.stereotype.Service;

// import java.util.List;
// import java.util.Optional;

// @Service
// public class UserService {

//     private final UserRepository userRepository;

//     public UserService(UserRepository userRepository) {
//         this.userRepository = userRepository;
//     }

//     public List<User> getAllUsers() {
//         return userRepository.findAll();
//     }

//     public Optional<User> getUserById(Long id) {
//         return userRepository.findById(id);
//     }

//     public List<User> searchByName(String name) {
//     return userRepository.findByNameContainingIgnoreCase(name);
// }

//     public User createUser(User user) {
//         if (userRepository.existsByEmail(user.getEmail())) {
//             throw new IllegalArgumentException("Email already in use: " + user.getEmail());
//         }
//         return userRepository.save(user);
//     }

//     public User updateUser(Long id, User updated) {
//         return userRepository.findById(id).map(existing -> {
//             existing.setName(updated.getName());
//             existing.setEmail(updated.getEmail());
//             existing.setRole(updated.getRole());
//             return userRepository.save(existing);
//         }).orElseThrow(() -> new RuntimeException("User not found: " + id));
//     }

//     public void deleteUser(Long id) {
//         if (!userRepository.existsById(id)) {
//             throw new RuntimeException("User not found: " + id);
//         }
//         userRepository.deleteById(id);
//     }
// }

package com.ecommerce.userservice.service;

import com.ecommerce.userservice.model.User;
import com.ecommerce.userservice.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public User createUser(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new IllegalArgumentException("Email already in use: " + user.getEmail());
        }
        return userRepository.save(user);
    }

    public User updateUser(Long id, User updated) {
        return userRepository.findById(id).map(existing -> {
            existing.setName(updated.getName());
            existing.setEmail(updated.getEmail());
            existing.setRole(updated.getRole());
            return userRepository.save(existing);
        }).orElseThrow(() -> new RuntimeException("User not found: " + id));
    }

    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("User not found: " + id);
        }
        userRepository.deleteById(id);
    }

    public List<User> searchByName(String name) {
        return userRepository.findByNameContainingIgnoreCase(name);
    }

    public Map<String, Long> getUserStats() {
        Map<String, Long> stats = new HashMap<>();
        stats.put("total",  userRepository.count());
        stats.put("admins", userRepository.countByRole("ADMIN"));
        stats.put("users",  userRepository.countByRole("USER"));
        return stats;
    }

    public List<User> getUsersByRole(String role) {
        return userRepository.findByRole(role);
    }
}