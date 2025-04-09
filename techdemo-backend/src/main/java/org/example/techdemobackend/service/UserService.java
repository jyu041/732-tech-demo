package org.example.techdemobackend.service;

import org.example.techdemobackend.model.User;
import org.example.techdemobackend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {

    @Value("${app.file.upload-dir}")
    private String uploadDir;

    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User createUser(String username, MultipartFile profilePicture) throws IOException {
        // Create uploads directory if it doesn't exist
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Save the profile picture
        String fileName = UUID.randomUUID() + "_" + profilePicture.getOriginalFilename();
        Path filePath = uploadPath.resolve(fileName);
        Files.copy(profilePicture.getInputStream(), filePath);

        // Create and save user
        User user = new User(username, fileName);
        return userRepository.save(user);
    }

    public Optional<User> getUserById(String id) {
        return userRepository.findById(id);
    }

    public Optional<User> getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User updateUser(User user) {
        return userRepository.save(user);
    }

    public void deleteUser(String id) {
        userRepository.deleteById(id);
    }

    // Since this is a single-user application, this method helps get or create the main user
    public User getOrCreateMainUser(String username, MultipartFile profilePicture) throws IOException {
        Optional<User> existingUser = userRepository.findAll().stream().findFirst();

        if (existingUser.isPresent()) {
            User user = existingUser.get();

            // Update if new data is provided
            if (username != null && !username.isEmpty()) {
                user.setUsername(username);
            }

            if (profilePicture != null && !profilePicture.isEmpty()) {
                // Delete old picture if exists
                if (user.getProfilePicturePath() != null) {
                    Path oldPicturePath = Paths.get(uploadDir).resolve(user.getProfilePicturePath());
                    Files.deleteIfExists(oldPicturePath);
                }

                // Save new picture
                String fileName = UUID.randomUUID() + "_" + profilePicture.getOriginalFilename();
                Path filePath = Paths.get(uploadDir).resolve(fileName);
                Files.copy(profilePicture.getInputStream(), filePath);
                user.setProfilePicturePath(fileName);
            }

            return userRepository.save(user);
        } else {
            // Create new user if none exists
            return createUser(username != null ? username : "User", profilePicture);
        }
    }
}