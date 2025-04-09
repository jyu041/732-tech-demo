package org.example.techdemobackend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "exgirlfriends")
public class ExGirlfriend {
    @Id
    private String id;
    private String name;
    private String profilePicturePath;
    private String personality; // Optional: personality traits to guide the LLM
    private String backstory;   // Optional: history with user to guide the LLM
    private LocalDateTime createdAt;

    // Default constructor required by MongoDB
    public ExGirlfriend() {
        this.createdAt = LocalDateTime.now();
    }

    public ExGirlfriend(String name, String profilePicturePath) {
        this.name = name;
        this.profilePicturePath = profilePicturePath;
        this.createdAt = LocalDateTime.now();
    }

    public ExGirlfriend(String name, String profilePicturePath, String personality, String backstory) {
        this.name = name;
        this.profilePicturePath = profilePicturePath;
        this.personality = personality;
        this.backstory = backstory;
        this.createdAt = LocalDateTime.now();
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getProfilePicturePath() {
        return profilePicturePath;
    }

    public void setProfilePicturePath(String profilePicturePath) {
        this.profilePicturePath = profilePicturePath;
    }

    public String getPersonality() {
        return personality;
    }

    public void setPersonality(String personality) {
        this.personality = personality;
    }

    public String getBackstory() {
        return backstory;
    }

    public void setBackstory(String backstory) {
        this.backstory = backstory;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}