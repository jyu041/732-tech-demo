package org.example.techdemobackend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "messages")
public class Message {
    @Id
    private String id;
    private String chatId;
    private String content;
    private String senderId;     // Either user ID or exgirlfriend ID
    private boolean isFromUser;  // True if from user, false if from ex-girlfriend
    private LocalDateTime timestamp;

    // Default constructor required by MongoDB
    public Message() {
        this.timestamp = LocalDateTime.now();
    }

    public Message(String chatId, String content, String senderId, boolean isFromUser) {
        this.chatId = chatId;
        this.content = content;
        this.senderId = senderId;
        this.isFromUser = isFromUser;
        this.timestamp = LocalDateTime.now();
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getChatId() {
        return chatId;
    }

    public void setChatId(String chatId) {
        this.chatId = chatId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getSenderId() {
        return senderId;
    }

    public void setSenderId(String senderId) {
        this.senderId = senderId;
    }

    public boolean isFromUser() {
        return isFromUser;
    }

    public void setFromUser(boolean fromUser) {
        isFromUser = fromUser;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}