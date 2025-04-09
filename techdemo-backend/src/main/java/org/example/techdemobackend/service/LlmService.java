package org.example.techdemobackend.service;

import org.example.techdemobackend.model.ExGirlfriend;
import org.example.techdemobackend.model.Message;
import org.example.techdemobackend.repository.ExGirlfriendRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class LlmService {

    private final ExGirlfriendRepository exGirlfriendRepository;

    @Autowired
    public LlmService(ExGirlfriendRepository exGirlfriendRepository) {
        this.exGirlfriendRepository = exGirlfriendRepository;
    }

    /**
     * Generates a response from the ex-girlfriend using a local LLM.
     * This is a placeholder implementation that will be replaced with actual LLM integration later.
     *
     * @param exGirlfriendId The ID of the ex-girlfriend
     * @param chatHistory The history of the conversation
     * @param userMessage The latest message from the user
     * @return A generated response
     */
    public String generateResponse(String exGirlfriendId, List<Message> chatHistory, String userMessage) {
        // Placeholder implementation - this will be replaced with actual LLM integration

        Optional<ExGirlfriend> exGirlfriendOptional = exGirlfriendRepository.findById(exGirlfriendId);
        if (exGirlfriendOptional.isPresent()) {
            ExGirlfriend exGirlfriend = exGirlfriendOptional.get();
            String name = exGirlfriend.getName();

            // For now, just return a simple response
            if (userMessage.toLowerCase().contains("miss you")) {
                return "I miss you too sometimes, but we both know why it didn't work out.";
            } else if (userMessage.toLowerCase().contains("sorry")) {
                return "I appreciate your apology, but some things can't be fixed with just words.";
            } else if (userMessage.toLowerCase().contains("love")) {
                return "We had some good times, but I've moved on. I hope you find happiness.";
            } else if (userMessage.toLowerCase().contains("how are you")) {
                return "I'm doing better these days. Taking time for myself. How about you?";
            } else {
                return "I'm not sure what to say about that. It's been a while since we talked.";
            }
        }

        return "I don't want to talk about this right now.";
    }

    /**
     * This method will be implemented when integrating with an actual LLM.
     * It would handle the context formatting, prompt engineering, etc.
     */
    private String formatPrompt(ExGirlfriend exGirlfriend, List<Message> chatHistory, String userMessage) {
        // This is a placeholder for future implementation
        StringBuilder prompt = new StringBuilder();

        // Add personality context
        prompt.append("You are role-playing as ").append(exGirlfriend.getName());
        prompt.append(", who is the ex-girlfriend of the user. ");

        if (exGirlfriend.getPersonality() != null && !exGirlfriend.getPersonality().isEmpty()) {
            prompt.append("Your personality: ").append(exGirlfriend.getPersonality()).append(". ");
        }

        if (exGirlfriend.getBackstory() != null && !exGirlfriend.getBackstory().isEmpty()) {
            prompt.append("Your backstory with the user: ").append(exGirlfriend.getBackstory()).append(". ");
        }

        // Add conversation history
        prompt.append("\nConversation history:\n");
        for (Message message : chatHistory) {
            prompt.append(message.isFromUser() ? "User: " : "You: ");
            prompt.append(message.getContent()).append("\n");
        }

        // Add the latest message and response instruction
        prompt.append("User: ").append(userMessage).append("\n");
        prompt.append("You: ");

        return prompt.toString();
    }
}