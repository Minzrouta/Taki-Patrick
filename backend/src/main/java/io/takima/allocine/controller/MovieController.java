package io.takima.allocine.controller;

import io.takima.allocine.model.Movie;
import io.takima.allocine.model.MovieSearchResultDTO;
import io.takima.allocine.model.MovieSuggestionDTO;
import io.takima.allocine.model.Review;
import io.takima.allocine.service.MovieService;
import io.takima.allocine.service.ReviewService;
import io.takima.allocine.service.TmdbService;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/movies")
@CrossOrigin
public class MovieController {

    private final MovieService movieService;
    private final ReviewService reviewService;
    private final TmdbService tmdbService;

    public MovieController(MovieService movieService, ReviewService reviewService, TmdbService tmdbService) {
        this.movieService = movieService;
        this.reviewService = reviewService;
        this.tmdbService = tmdbService;
    }

    /**
     * Recherche les infos complètes d'un film via TMDB à partir de son titre
     */
    @GetMapping("/search")
    public MovieSearchResultDTO searchMovie(@RequestParam String title) {
        return tmdbService.searchMovie(title)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Film non trouvé sur TMDB"));
    }

    /**
     * Retourne des suggestions de films (autocomplete) à partir d'un texte
     */
    @GetMapping("/suggestions")
    public List<MovieSuggestionDTO> getSuggestions(@RequestParam String query) {
        return tmdbService.searchSuggestions(query);
    }

    /**
     * Retourne les films populaires du moment
     */
    @GetMapping("/popular")
    public List<MovieSuggestionDTO> getPopularMovies() {
        return tmdbService.getPopularMovies();
    }

    /**
     * Retourne les infos complètes d'un film via son id TMDB
     */
    @GetMapping("/tmdb/{tmdbId}")
    public MovieSearchResultDTO getMovieByTmdbId(@PathVariable Long tmdbId) {
        return tmdbService.getMovieByTmdbId(tmdbId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Film non trouvé sur TMDB"));
    }

    /**
     * Liste tous les films
     *
     * @return
     */
    @GetMapping
    public List<Movie> getMovies() {
        return this.movieService.findAll();
    }

    /**
     * Récupère un film par son id
     *
     * @param id
     * @return
     */
    @GetMapping("/{id}")
    public Movie getFilmById(@PathVariable long id) {
        return this.movieService.findById(id);
    }

    /**
     * @param filmId
     * @return l'image correspondant à un film
     */
    @GetMapping(value = "/{filmId}/image", produces = MediaType.ALL_VALUE)
    public ResponseEntity<byte[]> getImage(@PathVariable Long filmId) {
        return ResponseEntity.of(movieService.getImage(filmId));
    }

    /**
     * @return la moyenne de satisfaction client soit la moyenne de tous les films
     */
    @GetMapping("/average")
    public int getAverageFilms() {
        List<Movie> movies = this.getMovies();
        int noteMaximale = 5;

        if (movies != null) {
            long total = movies.stream()
                    .filter(movie -> movie.getRate() != null)
                    .mapToDouble(Movie::getRate)
                    .count();

            if (total != 0) {
                return (int) (movies.stream()
                                        .filter(movie -> movie.getRate() != null)
                                        .mapToDouble(Movie::getRate)
                                        .sum() / total) * 100 / noteMaximale;
            }
        }

        return 0;
    }

    /**
     * @param id du User
     * @return tous les films pour lesquels l'utilisateur a donné un avis
     */
    @GetMapping("/byReviewer/{id}")
    public List<Movie> getMoviesByUserId(@PathVariable Long id) {
        return movieService.getMoviesByUserId(id);
    }

    /**
     * Ajoute un film
     *
     * @param movie
     * @return
     */
    @PostMapping
    public Movie addMovie(@RequestBody Movie movie) {
        return this.movieService.save(movie);
    }

    /**
     * Modifie les données d'un film
     *
     * @param movie
     * @return
     */
    @PutMapping("/{id}")
    public Movie updateMovie(@RequestBody Movie movie, @PathVariable Long id) {
        return movieService.updateMovie(movie, id);
    }

    /**
     * ajoute une image à un film et stocke l'image
     *
     * @param file
     * @param id
     */
    @PutMapping(value = "/{id}/image", headers = { "Content-Type=multipart/form-data" })
    public void addFile(@RequestParam("filmImage") MultipartFile file, @PathVariable Long id) {
        movieService.addFile(file, id);
    }

    /**
     * supprime l'image d'un film
     *
     * @param id
     */
    @DeleteMapping("{id}/image")
    public void deleteFile(@PathVariable Long id) {
        movieService.deleteFile(id);
    }

    /**
     * Supprime un film par son id
     *
     * @param id
     */
    @DeleteMapping("/{id}")
    public void deleteMovie(@PathVariable Long id) {
        this.movieService.deleteById(id);
    }

    /**
     * @param movieId
     * @return la liste des avis pour un film donné
     */
    @GetMapping("/{movieId}/reviews")
    public List<Review> getReviewByMovie(@PathVariable Long movieId) {
        return reviewService.getReviewByMovie(movieId);
    }
}
