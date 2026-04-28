package io.takima.allocine.service;

import io.takima.allocine.dao.UserDAO;
import io.takima.allocine.model.User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@Service
public class UserService {

    private UserDAO userDAO;

    public UserService(UserDAO userDAO) {
        this.userDAO = userDAO;
    }


    public List<User> findAll() {
        Iterable<User> it = userDAO.findAll();
        List<User> users = new ArrayList<>();
        it.forEach(users::add);
        return users;
    }

    public Optional<User> findByEmail(String email) {
        return userDAO.findByEmail(email);
    }

    public User findById(long id) {
        return userDAO.findById(id).orElseThrow(() -> new NoSuchElementException("User non existent"));
    }

    @Transactional
    public User addUser(User user) {
        user.setPoints(0);
        return userDAO.save(user);
    }

    @Transactional
    public void deleteById(Long id) {
        userDAO.deleteById(id);
    }

    @Transactional
    public User updateUser(Long id, User user) {
        user.setId(id);
        return userDAO.save(user);
    }
}
