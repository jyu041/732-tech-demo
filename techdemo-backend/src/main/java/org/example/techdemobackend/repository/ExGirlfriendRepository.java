package org.example.techdemobackend.repository;

import org.example.techdemobackend.model.ExGirlfriend;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ExGirlfriendRepository extends MongoRepository<ExGirlfriend, String> {
    Optional<ExGirlfriend> findByName(String name);
}