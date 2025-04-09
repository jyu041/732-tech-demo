package org.example.techdemobackend.controller;

import org.example.techdemobackend.model.ExGirlfriend;
import org.example.techdemobackend.model.User;
import org.example.techdemobackend.service.ExGirlfriendService;
import org.example.techdemobackend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/profiles")
public class ProfileController {

    private final UserService userService;
    private final ExGirlfriendService exGirlfriendService;

    @Autowired
    public ProfileController(UserService userService, ExGirlfriendService exGirlfriendService) {
        this.userService = userService;
        this.exGirlfriendService = exGirlfriendService;
    }

    // User profile endpoints
    @PostMapping("/user")
    public ResponseEntity<?> createOrUpdateUser(
            @RequestParam(value = "username", required = false) String username,
            @RequestParam(value = "profilePicture", required = false) MultipartFile profilePicture) {
        try {
            User user = userService.getOrCreateMainUser(username, profilePicture);
            return ResponseEntity.ok(user);
        } catch (IOException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to process user profile: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @GetMapping("/user")
    public ResponseEntity<?> getUser() {
        List<User> users = userService.getAllUsers();
        if (users.isEmpty()) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "No user profile found. Please create one.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
        // Return the first user (since this is a single-user application)
        return ResponseEntity.ok(users.get(0));
    }

    // Ex-girlfriend profile endpoints
    @PostMapping("/exgirlfriend")
    public ResponseEntity<?> createExGirlfriend(
            @RequestParam("name") String name,
            @RequestParam("profilePicture") MultipartFile profilePicture,
            @RequestParam(value = "personality", required = false) String personality,
            @RequestParam(value = "backstory", required = false) String backstory) {
        try {
            ExGirlfriend exGirlfriend = exGirlfriendService.createExGirlfriend(
                    name, profilePicture, personality, backstory);
            return ResponseEntity.status(HttpStatus.CREATED).body(exGirlfriend);
        } catch (IOException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to create ex-girlfriend profile: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @GetMapping("/exgirlfriend/{id}")
    public ResponseEntity<?> getExGirlfriend(@PathVariable String id) {
        Optional<ExGirlfriend> exGirlfriend = exGirlfriendService.getExGirlfriendById(id);
        return exGirlfriend
                .map(ResponseEntity::ok)
                .orElseGet(() -> {
                    Map<String, String> error = new HashMap<>();
                    error.put("error", "Ex-girlfriend not found with ID: " + id);
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body((ExGirlfriend) error);
                });
    }

    @GetMapping("/exgirlfriend")
    public ResponseEntity<List<ExGirlfriend>> getAllExGirlfriends() {
        List<ExGirlfriend> exGirlfriends = exGirlfriendService.getAllExGirlfriends();
        return ResponseEntity.ok(exGirlfriends);
    }

    @PutMapping("/exgirlfriend/{id}")
    public ResponseEntity<?> updateExGirlfriend(
            @PathVariable String id,
            @RequestParam(value = "name", required = false) String name,
            @RequestParam(value = "profilePicture", required = false) MultipartFile profilePicture,
            @RequestParam(value = "personality", required = false) String personality,
            @RequestParam(value = "backstory", required = false) String backstory) {
        try {
            Optional<ExGirlfriend> optionalExGirlfriend = exGirlfriendService.getExGirlfriendById(id);
            if (optionalExGirlfriend.isPresent()) {
                ExGirlfriend exGirlfriend = optionalExGirlfriend.get();

                if (name != null && !name.isEmpty()) {
                    exGirlfriend.setName(name);
                }

                if (personality != null) {
                    exGirlfriend.setPersonality(personality);
                }

                if (backstory != null) {
                    exGirlfriend.setBackstory(backstory);
                }

                if (profilePicture != null && !profilePicture.isEmpty()) {
                    exGirlfriend = exGirlfriendService.updateProfilePicture(id, profilePicture);
                } else {
                    exGirlfriend = exGirlfriendService.updateExGirlfriend(exGirlfriend);
                }

                return ResponseEntity.ok(exGirlfriend);
            } else {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Ex-girlfriend not found with ID: " + id);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
            }
        } catch (IOException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to update ex-girlfriend profile: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @DeleteMapping("/exgirlfriend/{id}")
    public ResponseEntity<?> deleteExGirlfriend(@PathVariable String id) {
        try {
            exGirlfriendService.deleteExGirlfriend(id);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Ex-girlfriend deleted successfully");
            return ResponseEntity.ok(response);
        } catch (IOException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to delete ex-girlfriend: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
}