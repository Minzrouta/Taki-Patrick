package io.takima.allocine.service;

import io.takima.allocine.dao.MovieDAO;
import io.takima.allocine.dao.ReviewDAO;
import io.takima.allocine.dao.UserDAO;
import io.takima.allocine.model.CheckReviewDTO;
import io.takima.allocine.model.Movie;
import io.takima.allocine.model.Review;
import io.takima.allocine.model.User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class ReviewService {
    private final ReviewDAO reviewDao;
    private final MovieService movieService;
    private final UserDAO userDAO;
    private final MovieDAO movieDAO;

    public ReviewService(ReviewDAO reviewDao, MovieService movieService, UserDAO userDAO, MovieDAO movieDAO) {
        this.reviewDao = reviewDao;
        this.movieService = movieService;
        this.userDAO = userDAO;
        this.movieDAO = movieDAO;
    }

    public List<Integer> findNbReviewByYear(String year) {
        int nbMonth = 12;
        List<Integer> nbAvisByMonth = new ArrayList<>();
        for (int i = 1; i <= nbMonth; i++) {
            String month = Integer.toString(i);
            Integer it = this.reviewDao.findNbReviewByYear(year, month);
            nbAvisByMonth.add(it);
        }
        return nbAvisByMonth;
    }

    public List<Review> findReviewByYear(String year) {
        Iterable<Review> it = this.reviewDao.findReviewByYear(year);
        List<Review> reviewList = new ArrayList<>();
        it.forEach(reviewList::add);
        return reviewList;
    }

    public Review addReview(Review review) {
        save(review);
        Float noteFilm = reviewDao.averageFilmRateByAvis(review.getMovie().getId());
        Movie movie = review.getMovie();
        User user = review.getUser();
        int points = (user.getPoints()) + 2;
        this.movieService.updateFilmRate(noteFilm, movie.getId());
        this.userDAO.updatePtsFidelites(points, user.getId());
        Date date = new Date();
        review.setReviewDate(date);
        return save(review);
    }

    public Review save(Review review) {
        return reviewDao.save(review);
    }

    public Review findById(Long id) {
        return reviewDao.findById(id).orElseThrow(() -> new NoSuchElementException("Avis non existent"));
    }

    public List<Review> getReviews() {
        Iterable<Review> it = this.reviewDao.findAll();
        List<Review> reviews = new ArrayList<>();
        it.forEach(reviews::add);
        return reviews;
    }

    @Transactional
    public Review updateReview(Long id, Review review) {
        return reviewDao.findById(id)
                .map(r -> {
                    r.setId(id);
                    r.setText(review.getText());
                    Date date = new Date();
                    r.setReviewDate(date);
                    r.setUser(review.getUser());
                    r.setMovie(review.getMovie());
                    r.setRate(review.getRate());
                    save(r);
                    Float newRate = reviewDao.averageFilmRateByAvis(review.getMovie().getId());
                    Movie movie = r.getMovie();
                    try {
                        this.movieService.updateFilmRate(newRate, movie.getId());
                    } catch (Exception e) {
                        System.out.println(e.getMessage());
                    }
                    return save(review);
                })
                .orElseGet(() -> {
                    review.setId(id);
                    return save(review);
                });
    }

    @Transactional
    public void deleteReview(Long id) {
        Review review = findById(id);
        Movie movie = review.getMovie();
        reviewDao.deleteById(id);
        int nbAvis = reviewDao.findNbAvisByFilmId(movie.getId());
        if (nbAvis > 0) {
            Float noteFilm = reviewDao.averageFilmRateByAvis(movie.getId());
            this.movieService.updateFilmRate(noteFilm, movie.getId());
        } else this.movieDAO.updateNoteFilmNull(movie.getId());

    }

    public List<Review> getReviewsByUserId(Long id) {
        Iterable<Review> it = this.reviewDao.getReviewsByUserId(id);
        List<Review> reviewList = new ArrayList<>();
        it.forEach(reviewList::add);
        return reviewList;
    }

    public List<Review> getReviewByMovie(Long movieId) {
        Iterable<Review> it = this.reviewDao.findAvisByFilmId(movieId);
        List<Review> avis = new ArrayList<>();
        it.forEach(avis::add);
        return avis;
    }

    public boolean checkAddReview(CheckReviewDTO checkAvis) {
        Long userId = checkAvis.getUserId();
        Long filmId = checkAvis.getFilmId();
        int nbsAvis = this.reviewDao.countAvisByUserAndFilm(userId, filmId);
        return nbsAvis > 1;
    }

    public List<Integer> findAllYearsReviews() {
        return reviewDao.findAllYearsReviews();
    }
}
