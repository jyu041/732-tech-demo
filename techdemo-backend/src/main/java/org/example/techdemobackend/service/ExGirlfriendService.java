package org.example.techdemobackend.service;

import org.example.techdemobackend.model.ExGirlfriend;
import org.example.techdemobackend.repository.ExGirlfriendRepository;
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
public class ExGirlfriendService {

    @Value("${app.file.upload-dir}")
    private String uploadDir;

    private final ExGirlfriendRepository exGirlfriendRepository;

    @Autowired
    public ExGirlfriendService(ExGirlfriendRepository exGirlfriendRepository) {
        this.exGirlfriendRepository = exGirlfriendRepository;
    }

    public ExGirlfriend createExGirlfriend(String name, MultipartFile profilePicture,
                                           String personality, String backstory) throws IOException {
        // Create uploads directory if it doesn't exist
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Save the profile picture
        String fileName = UUID.randomUUID() + "_" + profilePicture.getOriginalFilename();
        Path filePath = uploadPath.resolve(fileName);
        Files.copy(profilePicture.getInputStream(), filePath);

        // Create and save ex-girlfriend
        ExGirlfriend exGirlfriend = new ExGirlfriend(name, fileName, personality, backstory);
        return exGirlfriendRepository.save(exGirlfriend);
    }

    public Optional<ExGirlfriend> getExGirlfriendById(String id) {
        return exGirlfriendRepository.findById(id);
    }

    public Optional<ExGirlfriend> getExGirlfriendByName(String name) {
        return exGirlfriendRepository.findByName(name);
    }

    public List<ExGirlfriend> getAllExGirlfriends() {
        return exGirlfriendRepository.findAll();
    }

    public ExGirlfriend updateExGirlfriend(ExGirlfriend exGirlfriend) {
        return exGirlfriendRepository.save(exGirlfriend);
    }

    public void deleteExGirlfriend(String id) throws IOException {
        Optional<ExGirlfriend> exGirlfriend = exGirlfriendRepository.findById(id);
        if (exGirlfriend.isPresent() && exGirlfriend.get().getProfilePicturePath() != null) {
            // Delete profile picture
            Path picturePath = Paths.get(uploadDir).resolve(exGirlfriend.get().getProfilePicturePath());
            Files.deleteIfExists(picturePath);
        }
        exGirlfriendRepository.deleteById(id);
    }

    // Helper method to update profile picture
    public ExGirlfriend updateProfilePicture(String id, MultipartFile profilePicture) throws IOException {
        Optional<ExGirlfriend> optionalExGirlfriend = exGirlfriendRepository.findById(id);
        if (optionalExGirlfriend.isPresent()) {
            ExGirlfriend exGirlfriend = optionalExGirlfriend.get();

            // Delete old picture if exists
            if (exGirlfriend.getProfilePicturePath() != null) {
                Path oldPicturePath = Paths.get(uploadDir).resolve(exGirlfriend.getProfilePicturePath());
                Files.deleteIfExists(oldPicturePath);
            }

            // Save new picture
            String fileName = UUID.randomUUID() + "_" + profilePicture.getOriginalFilename();
            Path filePath = Paths.get(uploadDir).resolve(fileName);
            Files.copy(profilePicture.getInputStream(), filePath);

            exGirlfriend.setProfilePicturePath(fileName);
            return exGirlfriendRepository.save(exGirlfriend);
        } else {
            throw new IllegalArgumentException("Ex-girlfriend not found with ID: " + id);
        }
    }
}