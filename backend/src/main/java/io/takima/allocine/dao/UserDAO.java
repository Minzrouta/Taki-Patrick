package io.takima.allocine.dao;

import io.takima.allocine.model.User;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public interface UserDAO extends CrudRepository<User, Long> {
    /**
     *
     * @param email
     * @return un user en fonction de son email
     */
    Optional<User> findByEmail(String email);

    /**
     * Update des points de fidélités d'un user
     * @param pts
     * @param userId
     */
    @Modifying
    @Transactional
    @Query(value = "UPDATE app_user SET points = :pts WHERE id = :userId",
            nativeQuery = true)
    void updatePtsFidelites(int pts, Long userId);
}
