package org.example.techdemobackend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "chats")
public class Chat {
    @Id
    private String id;
    private String userId;
    private String exGirlfriendId;
    private LocalDateTime createdAt;
    private LocalDateTime lastMessageAt;

    // Default constructor required by MongoDB
    public Chat() {
        this.createdAt = LocalDateTime.now();
        this.lastMessageAt = this.createdAt;
    }

    public Chat(String userId, String exGirlfriendId) {
        this.userId = userId;
        this.exGirlfriendId = exGirlfriendId;
        this.createdAt = LocalDateTime.now();
        this.lastMessageAt = this.createdAt;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getExGirlfriendId() {
        return exGirlfriendId;
    }

    public void setExGirlfriendId(String exGirlfriendId) {
        this.exGirlfriendId = exGirlfriendId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getLastMessageAt() {
        return lastMessageAt;
    }

    public void setLastMessageAt(LocalDateTime lastMessageAt) {
        this.lastMessageAt = lastMessageAt;
    }

    public void updateLastMessageTime() {
        this.lastMessageAt = LocalDateTime.now();
    }
}