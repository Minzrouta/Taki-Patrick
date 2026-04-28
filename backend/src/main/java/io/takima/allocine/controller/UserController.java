package io.takima.allocine.controller;

import io.takima.allocine.model.Review;
import io.takima.allocine.model.User;
import io.takima.allocine.service.ReviewService;
import io.takima.allocine.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/users")
@CrossOrigin
public class UserController {

    private final UserService userService;
    private final ReviewService reviewService;

    public UserController(UserService userService, ReviewService reviewService) {
        this.userService = userService;
        this.reviewService = reviewService;
    }

    /**
     * Liste tous les utilisateurs
     *
     * @return
     */
    @GetMapping
    public List<User> getUsers() {
        return this.userService.findAll();
    }

    /**
     * Recupère un utilisateur en fonction de son id
     *
     * @param id
     * @return
     */
    @GetMapping("/{id}")
    public User getUserById(@PathVariable Long id) {
        return userService.findById(id);
    }


    /**
     * Récupère un utilisateur en fonction de son email
     *
     * @param email
     * @return
     */
    @GetMapping("byEmail/{email}")
    public User getUserByEmail(@PathVariable String email) {
        return userService.findByEmail(email).orElse(null);
    }

    /**
     * Ajoute un utilisateur en initialisant ses points de fidélité à 0
     *
     * @param user
     * @return
     */
    @PostMapping
    public User addUser(@RequestBody User user) {
        return userService.addUser(user);
    }

    /**
     * Modifie les données d'un user
     * @param user
     * @return
     */
    @PutMapping("/{id}")
    public User putUser(@PathVariable Long id, @RequestBody User user) {
        return userService.updateUser(id, user);
    }

    /**
     * Supprime un User par son id
     *
     * @param id
     */
    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Long id) {
        this.userService.deleteById(id);
    }

    /**
     * @param id du User
     * @return la liste des avis pour un utilisateur donné
     */
    @GetMapping("/{id}/reviews")
    public List<Review> getReviewByUserId(@PathVariable Long id) {
        return reviewService.getReviewsByUserId(id);
    }

}


