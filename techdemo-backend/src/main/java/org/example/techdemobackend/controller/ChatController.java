package org.example.techdemobackend.controller;

import org.example.techdemobackend.model.Chat;
import org.example.techdemobackend.model.ExGirlfriend;
import org.example.techdemobackend.model.Message;
import org.example.techdemobackend.model.User;
import org.example.techdemobackend.service.ChatService;
import org.example.techdemobackend.service.ExGirlfriendService;
import org.example.techdemobackend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/chats")
public class ChatController {

    private final ChatService chatService;
    private final UserService userService;
    private final ExGirlfriendService exGirlfriendService;

    @Autowired
    public ChatController(ChatService chatService,
                          UserService userService,
                          ExGirlfriendService exGirlfriendService) {
        this.chatService = chatService;
        this.userService = userService;
        this.exGirlfriendService = exGirlfriendService;
    }

    @PostMapping("/start")
    public ResponseEntity<?> startChat(@RequestParam String exGirlfriendId) {
        try {
            // Get the main user (first user)
            List<User> users = userService.getAllUsers();
            if (users.isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "No user profile found. Please create a user profile first.");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
            }

            User user = users.get(0);

            // Get the ex-girlfriend
            Optional<ExGirlfriend> optionalExGirlfriend = exGirlfriendService.getExGirlfriendById(exGirlfriendId);
            if (optionalExGirlfriend.isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Ex-girlfriend not found with ID: " + exGirlfriendId);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
            }

            ExGirlfriend exGirlfriend = optionalExGirlfriend.get();

            // Create or get existing chat
            Chat chat = chatService.createChat(user, exGirlfriend);
            return ResponseEntity.ok(chat);

        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to start chat: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @GetMapping("/{chatId}")
    public ResponseEntity<?> getChat(@PathVariable String chatId) {
        Optional<Chat> chat = chatService.getChatById(chatId);
        return chat
                .map(ResponseEntity::ok)
                .orElseGet(() -> {
                    Map<String, String> error = new HashMap<>();
                    error.put("error", "Chat not found with ID: " + chatId);
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body((Chat) error);
                });
    }

    @GetMapping("/user")
    public ResponseEntity<?> getUserChats() {
        List<User> users = userService.getAllUsers();
        if (users.isEmpty()) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "No user profile found.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }

        User user = users.get(0);
        List<Chat> chats = chatService.getChatsByUserId(user.getId());
        return ResponseEntity.ok(chats);
    }

    @GetMapping("/{chatId}/messages")
    public ResponseEntity<?> getChatMessages(@PathVariable String chatId) {
        try {
            Optional<Chat> chat = chatService.getChatById(chatId);
            if (chat.isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Chat not found with ID: " + chatId);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
            }

            List<Message> messages = chatService.getChatHistory(chatId);
            return ResponseEntity.ok(messages);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to get chat messages: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @GetMapping("/{chatId}/recent-messages")
    public ResponseEntity<?> getRecentMessages(@PathVariable String chatId) {
        try {
            Optional<Chat> chat = chatService.getChatById(chatId);
            if (chat.isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Chat not found with ID: " + chatId);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
            }

            List<Message> messages = chatService.getRecentMessages(chatId);
            return ResponseEntity.ok(messages);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to get recent messages: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @PostMapping("/{chatId}/messages")
    public ResponseEntity<?> sendMessage(
            @PathVariable String chatId,
            @RequestBody Map<String, String> messageRequest) {
        try {
            // Validate request
            if (!messageRequest.containsKey("content") || messageRequest.get("content").trim().isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Message content is required");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
            }

            // Get the main user
            List<User> users = userService.getAllUsers();
            if (users.isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "No user profile found");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
            }

            User user = users.get(0);
            String content = messageRequest.get("content");

            // Send the message and get the AI response
            Message aiResponse = chatService.sendUserMessage(chatId, user.getId(), content);

            // Return both the user message and the AI response
            Map<String, Object> response = new HashMap<>();
            response.put("aiResponse", aiResponse);

            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to send message: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @DeleteMapping("/{chatId}")
    public ResponseEntity<?> deleteChat(@PathVariable String chatId) {
        try {
            Optional<Chat> chat = chatService.getChatById(chatId);
            if (chat.isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Chat not found with ID: " + chatId);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
            }

            chatService.deleteChat(chatId);

            Map<String, String> response = new HashMap<>();
            response.put("message", "Chat deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to delete chat: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
}