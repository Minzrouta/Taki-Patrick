package io.takima.allocine.model;

public class MovieSuggestionDTO {
    private Long tmdbId;
    private String title;
    private String year;
    private String posterUrl;

    public MovieSuggestionDTO() {}

    public MovieSuggestionDTO(Long tmdbId, String title, String year, String posterUrl) {
        this.tmdbId = tmdbId;
        this.title = title;
        this.year = year;
        this.posterUrl = posterUrl;
    }

    public Long getTmdbId() { return tmdbId; }
    public void setTmdbId(Long tmdbId) { this.tmdbId = tmdbId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getYear() { return year; }
    public void setYear(String year) { this.year = year; }

    public String getPosterUrl() { return posterUrl; }
    public void setPosterUrl(String posterUrl) { this.posterUrl = posterUrl; }
}
