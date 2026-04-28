package io.takima.allocine.service;

import io.takima.allocine.dao.MovieDAO;
import io.takima.allocine.model.Movie;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@Service
public class MovieService {
    MovieDAO movieDAO;
    StorageService storageService;

    public MovieService(MovieDAO movieDAO, StorageService storageService) {
        this.movieDAO = movieDAO;
        this.storageService = storageService;
    }

    public List<Movie> findAll() {
        Iterable<Movie> it = movieDAO.findAll();
        List<Movie> movies = new ArrayList<>();
        it.forEach(movies::add);
        return movies;
    }

    public Movie findById(long id) {
        return movieDAO.findById(id).orElseThrow(() -> new NoSuchElementException("Film non existent"));
    }

    public Optional<byte[]> getImage(Long filmId) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentDisposition(ContentDisposition.builder("attachement").filename("filename.png").build());
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        return this.movieDAO.findById(filmId)
                .map(Movie::getImage)
                .map(storageService::load);
    }

    @Transactional
    public Movie save(Movie movie) {
        return movieDAO.save(movie);
    }

    @Transactional
    public void addFile(MultipartFile file, Long id) {
        Movie movie = findById(id);
        String extension = StringUtils.getFilenameExtension(file.getOriginalFilename());
        if (movie.getImage() != null) {
            storageService.delete(movie.getImage());
        }
        movie.setImage("image_film_" + id + "." + extension);
        save(movie);
        storageService.store(file, "image_film_" + id + "." + extension);
    }

    @Transactional
    public void deleteFile(Long id) {
        Movie movie = movieDAO.findById(id).orElseThrow(() -> new NoSuchElementException("Film non existent"));
        storageService.delete(movie.getImage());
        movie.setImage(null);
        movieDAO.save(movie);
    }

    public Movie updateMovie(Movie newMovie, Long id) {
        return this.movieDAO.findById(id)
                .map(film -> {
                    film.setTitle(newMovie.getTitle());
                    film.setDirector(newMovie.getDirector());
                    film.setReleaseDate(newMovie.getReleaseDate());
                    film.setSynopsis(newMovie.getSynopsis());
                    return this.movieDAO.save(film);
                })
                .orElseGet(() -> {
                    newMovie.setId(id);
                    return this.movieDAO.save(newMovie);
                });
    }

    public void deleteById(Long id) {
        movieDAO.deleteById(id);
    }

    public List<Movie> getMoviesByUserId(Long id) {
        Iterable<Movie> it = this.movieDAO.getMoviesByUserId(id);
        List<Movie> movies = new ArrayList<>();
        it.forEach(movies::add);
        return movies;
    }

    @Transactional
    public void updateFilmRate(Float newRate, Long id) {
        movieDAO.updateFilmRate(newRate, id);
    }
}
