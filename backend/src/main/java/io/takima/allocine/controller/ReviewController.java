package io.takima.allocine.controller;

import io.takima.allocine.dao.MovieDAO;
import io.takima.allocine.dao.UserDAO;
import io.takima.allocine.model.Review;
import io.takima.allocine.model.Movie;
import io.takima.allocine.model.CheckReviewDTO;
import io.takima.allocine.service.ReviewService;
import org.springframework.web.bind.annotation.*;

import java.util.*;


@RestController
@RequestMapping("/reviews")
@CrossOrigin
public class ReviewController {

    private final ReviewService reviewService;


    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    /**
     * @return retourne une liste de tous les avis
     */
    @GetMapping()
    public List<Review> getReviews() {
        return reviewService.getReviews();
    }

    /**
     * Méthode get
     *
     * @param id
     * @return un avis en fonction de son id
     */
    @GetMapping("/{id}")
    public Review getReviewById(@PathVariable Long id) {
        return this.reviewService.findById(id);
    }

    /**
     * @param year
     * @return un tableau de longueur 12, avec le nb d'avis par mois pour une année
     */
    @GetMapping({"byYear/{year}/quantity"})
    public List<Integer> findNbReviewByYear(@PathVariable String year) {
        return reviewService.findNbReviewByYear(year);
    }

    /**
     * @param year
     * @return tous les avis d'une année précise
     */
    @GetMapping({"byYear/{year}"})
    public List<Review> findReviewByYear(@PathVariable String year) {
        return reviewService.findReviewByYear(year);
    }

    /**
     * A l'ajout d'un avis on update également la note du film concerné et
     * le nombre de points de fidélité du User auteur de l'ajout de l'avis
     *
     * @param review
     * @return un avis qui vient d'être ajouté
     */
    @PostMapping()
    public Review addReview(@RequestBody Review review) {
        return reviewService.addReview(review);
    }

    /**
     * Modifie un avis en mettant à jour la note du film concernée si la modification
     * de l'avis concerne la note donnée
     *
     * @param review
     * @return
     */
    @PutMapping("/{id}")
    public Review updateReview(@PathVariable Long id, @RequestBody Review review) {
        return reviewService.updateReview(id, review);
    }

    /**
     * Supprime un avis par son id et change la note du film correspondant
     *
     * @param id
     */
    @DeleteMapping("/{id}")
    public void deleteReview(@PathVariable Long id) {
        reviewService.deleteReview(id);
    }

    /**
     * @param checkAvis
     * @return si un user a deja mis un avis pour un film
     */
    @GetMapping("/checkAvis")
    public boolean checkAddReview(CheckReviewDTO checkAvis) {
        return reviewService.checkAddReview(checkAvis);
    }

    /**
     * Méthode get
     *
     * @return toutes les années de publication d'avis
     */
    @GetMapping("/findAllYears")
    public List<Integer> findAllYears() {
        return reviewService.findAllYearsReviews();

    }
}
