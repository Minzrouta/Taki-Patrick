package io.takima.allocine.dao;

import io.takima.allocine.model.Review;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.Query;

@Repository
public interface ReviewDAO extends CrudRepository<Review, Long> {
    /**
     * @param movie_id
     * @return un avis en fonction du film indiqué
     */
    @Query(value = "SELECT * FROM review WHERE movie_id= ?1", nativeQuery = true)
    Iterable<Review> findAvisByFilmId(Long movie_id);

    /**
     * @param movie_id
     * @return le nombre d'avis d'un film
     */
    @Query(value = "SELECT COUNT(*) FROM review WHERE movie_id= ?1", nativeQuery = true)
    Integer findNbAvisByFilmId(Long movie_id);

    /**
     * @param year
     * @param month
     * @return le nombre d'avis pour un mois et une année donnée
     */
    @Query(value = "SELECT COUNT(*) FROM review a WHERE CAST(EXTRACT(YEAR FROM review_date) AS VARCHAR) = ?1 AND CAST(EXTRACT(MONTH FROM review_date) AS VARCHAR) = ?2",
            nativeQuery = true)
    Integer findNbReviewByYear(String year, String month);

    /**
     * @param year
     * @return les avis d'une année donnée
     */
    @Query(value = "SELECT * FROM review a WHERE CAST(EXTRACT(YEAR FROM review_date) AS VARCHAR) = ?1",
            nativeQuery = true)
    Iterable<Review> findReviewByYear(String year);

    /**
     * @param userId
     * @return la liste des avis pour un user donné
     */
    @Query(value = "SELECT a.id, a.text, a.rate, a.movie_id, a.user_id, a.review_date FROM review a WHERE user_id = ?1",
            nativeQuery = true)
    Iterable<Review> getReviewsByUserId(long userId);

    /**
     * @param filmId
     * @return la note moyenne des avis d'un film donné
     */
    @Query(value = "SELECT AVG(rate) FROM review WHERE movie_id=?", nativeQuery = true)
    Float averageFilmRateByAvis(Long filmId);

    /**
     * @return toutes les années de publication des avis
     */
    @Query(value = "SELECT DISTINCT EXTRACT(YEAR FROM review_date) FROM review ORDER BY EXTRACT(YEAR FROM review_date) DESC", nativeQuery = true)
    List<Integer> findAllYearsReviews();

    /**
     * @param userId
     * @param FilmId
     * @return le nombre d'avis pour un user et un film donné
     */
    @Query(value = "SELECT COUNT(*) FROM review WHERE user_id= ?1 and movie_id = ?2",
            nativeQuery = true)
    Integer countAvisByUserAndFilm(Long userId, Long FilmId);
}
