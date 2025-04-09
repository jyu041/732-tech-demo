package org.example.techdemobackend.repository;

import org.example.techdemobackend.model.Message;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends MongoRepository<Message, String> {
    List<Message> findByChatIdOrderByTimestampAsc(String chatId);
    List<Message> findTop20ByChatIdOrderByTimestampDesc(String chatId);
}