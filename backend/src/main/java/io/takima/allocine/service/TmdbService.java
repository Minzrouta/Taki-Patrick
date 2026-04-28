package io.takima.allocine.service;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import io.takima.allocine.model.MovieSearchResultDTO;
import io.takima.allocine.model.MovieSuggestionDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class TmdbService {

    private static final String TMDB_BASE_URL = "https://api.themoviedb.org/3";
    private static final String POSTER_BASE_URL = "https://image.tmdb.org/t/p/w500";
    private static final SimpleDateFormat DATE_FORMAT = new SimpleDateFormat("yyyy-MM-dd");

    private final RestTemplate restTemplate;
    private final String apiKey;

    public TmdbService(RestTemplate restTemplate, @Value("${tmdb.api-key}") String apiKey) {
        this.restTemplate = restTemplate;
        this.apiKey = apiKey;
    }

    public Optional<MovieSearchResultDTO> searchMovie(String title) {
        String searchUrl = buildUrl(TMDB_BASE_URL + "/search/movie")
                .queryParam("query", title)
                .queryParam("language", "fr-FR")
                .toUriString();

        TmdbSearchResponse response = restTemplate.getForObject(searchUrl, TmdbSearchResponse.class);
        if (response == null || response.results == null || response.results.isEmpty()) {
            return Optional.empty();
        }
        return Optional.of(toFullDTO(response.results.get(0)));
    }

    public List<MovieSuggestionDTO> searchSuggestions(String query) {
        String url = buildUrl(TMDB_BASE_URL + "/search/movie")
                .queryParam("query", query)
                .queryParam("language", "fr-FR")
                .toUriString();

        TmdbSearchResponse response = restTemplate.getForObject(url, TmdbSearchResponse.class);
        if (response == null || response.results == null) return List.of();

        return response.results.stream()
                .limit(6)
                .map(this::toSuggestionDTO)
                .toList();
    }

    public List<MovieSuggestionDTO> getPopularMovies() {
        String url = buildUrl(TMDB_BASE_URL + "/movie/popular")
                .queryParam("language", "fr-FR")
                .toUriString();

        TmdbSearchResponse response = restTemplate.getForObject(url, TmdbSearchResponse.class);
        if (response == null || response.results == null) return List.of();

        return response.results.stream()
                .limit(12)
                .map(this::toSuggestionDTO)
                .toList();
    }

    public Optional<MovieSearchResultDTO> getMovieByTmdbId(Long tmdbId) {
        String url = buildUrl(TMDB_BASE_URL + "/movie/" + tmdbId)
                .queryParam("language", "fr-FR")
                .toUriString();

        TmdbMovie movie = restTemplate.getForObject(url, TmdbMovie.class);
        if (movie == null) return Optional.empty();

        return Optional.of(toFullDTO(movie));
    }

    private MovieSearchResultDTO toFullDTO(TmdbMovie movie) {
        String director = fetchDirector(movie.id);
        Date releaseDate = parseDate(movie.releaseDate);
        String posterUrl = movie.posterPath != null ? POSTER_BASE_URL + movie.posterPath : null;
        return new MovieSearchResultDTO(movie.title, director, releaseDate, movie.overview, posterUrl);
    }

    private MovieSuggestionDTO toSuggestionDTO(TmdbMovie movie) {
        String year = movie.releaseDate != null && movie.releaseDate.length() >= 4
                ? movie.releaseDate.substring(0, 4) : "";
        String posterUrl = movie.posterPath != null ? POSTER_BASE_URL + movie.posterPath : null;
        return new MovieSuggestionDTO(movie.id, movie.title, year, posterUrl);
    }

    private String fetchDirector(Long movieId) {
        String url = buildUrl(TMDB_BASE_URL + "/movie/" + movieId + "/credits").toUriString();
        TmdbCreditsResponse credits = restTemplate.getForObject(url, TmdbCreditsResponse.class);
        if (credits == null || credits.crew == null) return null;
        return credits.crew.stream()
                .filter(c -> "Director".equals(c.job))
                .map(c -> c.name)
                .findFirst()
                .orElse(null);
    }

    private UriComponentsBuilder buildUrl(String url) {
        return UriComponentsBuilder.fromHttpUrl(url).queryParam("api_key", apiKey);
    }

    private Date parseDate(String dateStr) {
        if (dateStr == null || dateStr.isBlank()) return null;
        try {
            return DATE_FORMAT.parse(dateStr);
        } catch (ParseException e) {
            return null;
        }
    }

    // --- DTOs internes TMDB ---

    @JsonIgnoreProperties(ignoreUnknown = true)
    static class TmdbSearchResponse {
        public List<TmdbMovie> results;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    static class TmdbMovie {
        public Long id;
        public String title;
        public String overview;
        @JsonProperty("release_date")
        public String releaseDate;
        @JsonProperty("poster_path")
        public String posterPath;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    static class TmdbCreditsResponse {
        public List<TmdbCrewMember> crew;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    static class TmdbCrewMember {
        public String name;
        public String job;
    }
}
