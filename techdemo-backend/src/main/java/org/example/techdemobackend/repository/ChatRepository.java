package org.example.techdemobackend.repository;

import org.example.techdemobackend.model.Chat;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChatRepository extends MongoRepository<Chat, String> {
    List<Chat> findByUserId(String userId);
    List<Chat> findByExGirlfriendId(String exGirlfriendId);
    Optional<Chat> findByUserIdAndExGirlfriendId(String userId, String exGirlfriendId);
}