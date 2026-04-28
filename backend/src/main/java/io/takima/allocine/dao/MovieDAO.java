package io.takima.allocine.dao;

import io.takima.allocine.model.Movie;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MovieDAO extends CrudRepository<Movie, Long> {
    /**
     * @param userId
     * @return tous les films pour lesquels un user a laissé un avis
     */
    @Query(value = "SELECT distinct f.id, f.title, f.director, f.rate, f.release_date, f.synopsis, f.image  FROM review a INNER JOIN movie f on a.movie_id = f.id WHERE user_id = ?1",
            nativeQuery = true)
    Iterable<Movie> getMoviesByUserId(long userId);

    /**
     * Update de la note du film avec une valuer passée en parametre
     *
     * @param rate
     * @param movieId
     */
    @Modifying
    @Query(value = "UPDATE movie SET rate = :rate WHERE id = :movieId",
            nativeQuery = true)
    void updateFilmRate(float rate, Long movieId);

    /**
     * Update de la note du film à null
     *
     * @param movieId
     */
    @Modifying
    @Query(value = "UPDATE movie SET rate = null WHERE id = :movieId",
            nativeQuery = true)
    void updateNoteFilmNull(Long movieId);
}

