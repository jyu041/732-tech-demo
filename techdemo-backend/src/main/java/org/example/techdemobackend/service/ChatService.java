package org.example.techdemobackend.service;

import org.example.techdemobackend.model.Chat;
import org.example.techdemobackend.model.ExGirlfriend;
import org.example.techdemobackend.model.Message;
import org.example.techdemobackend.model.User;
import org.example.techdemobackend.repository.ChatRepository;
import org.example.techdemobackend.repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class ChatService {

    private final ChatRepository chatRepository;
    private final MessageRepository messageRepository;
    private final LlmService llmService;

    @Autowired
    public ChatService(ChatRepository chatRepository,
                       MessageRepository messageRepository,
                       LlmService llmService) {
        this.chatRepository = chatRepository;
        this.messageRepository = messageRepository;
        this.llmService = llmService;
    }

    public Chat createChat(User user, ExGirlfriend exGirlfriend) {
        // Check if a chat already exists
        Optional<Chat> existingChat = chatRepository.findByUserIdAndExGirlfriendId(
                user.getId(), exGirlfriend.getId());

        if (existingChat.isPresent()) {
            return existingChat.get();
        }

        // Create new chat
        Chat chat = new Chat(user.getId(), exGirlfriend.getId());
        return chatRepository.save(chat);
    }

    public Optional<Chat> getChatById(String id) {
        return chatRepository.findById(id);
    }

    public List<Chat> getChatsByUserId(String userId) {
        return chatRepository.findByUserId(userId);
    }

    public List<Chat> getChatsByExGirlfriendId(String exGirlfriendId) {
        return chatRepository.findByExGirlfriendId(exGirlfriendId);
    }

    public Message sendMessage(String chatId, String senderId, boolean isFromUser, String content) {
        Optional<Chat> chatOptional = chatRepository.findById(chatId);

        if (chatOptional.isPresent()) {
            Chat chat = chatOptional.get();
            chat.updateLastMessageTime();
            chatRepository.save(chat);

            Message message = new Message(chatId, content, senderId, isFromUser);
            return messageRepository.save(message);
        } else {
            throw new IllegalArgumentException("Chat not found with ID: " + chatId);
        }
    }

    public Message sendUserMessage(String chatId, String userId, String content) {
        Message userMessage = sendMessage(chatId, userId, true, content);

        // Get chat details for context
        Optional<Chat> chatOptional = chatRepository.findById(chatId);
        if (chatOptional.isPresent()) {
            Chat chat = chatOptional.get();

            // Generate AI response
            String aiResponse = llmService.generateResponse(chat.getExGirlfriendId(), getChatHistory(chatId), content);

            // Save AI response
            return sendMessage(chatId, chat.getExGirlfriendId(), false, aiResponse);
        }

        return userMessage;
    }

    public List<Message> getChatHistory(String chatId) {
        return messageRepository.findByChatIdOrderByTimestampAsc(chatId);
    }

    public List<Message> getRecentMessages(String chatId) {
        List<Message> messages = messageRepository.findTop20ByChatIdOrderByTimestampDesc(chatId);
        Collections.reverse(messages); // Reverse to get chronological order
        return messages;
    }

    public void deleteChat(String chatId) {
        // Delete all messages in the chat
        List<Message> messages = messageRepository.findByChatIdOrderByTimestampAsc(chatId);
        messageRepository.deleteAll(messages);

        // Delete the chat
        chatRepository.deleteById(chatId);
    }
}