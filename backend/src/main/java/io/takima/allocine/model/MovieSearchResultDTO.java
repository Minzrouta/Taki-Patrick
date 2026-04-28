package io.takima.allocine.model;

import java.util.Date;

public class MovieSearchResultDTO {
    private String title;
    private String director;
    private Date releaseDate;
    private String synopsis;
    private String posterUrl;

    public MovieSearchResultDTO() {}

    public MovieSearchResultDTO(String title, String director, Date releaseDate, String synopsis, String posterUrl) {
        this.title = title;
        this.director = director;
        this.releaseDate = releaseDate;
        this.synopsis = synopsis;
        this.posterUrl = posterUrl;
    }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDirector() { return director; }
    public void setDirector(String director) { this.director = director; }

    public Date getReleaseDate() { return releaseDate; }
    public void setReleaseDate(Date releaseDate) { this.releaseDate = releaseDate; }

    public String getSynopsis() { return synopsis; }
    public void setSynopsis(String synopsis) { this.synopsis = synopsis; }

    public String getPosterUrl() { return posterUrl; }
    public void setPosterUrl(String posterUrl) { this.posterUrl = posterUrl; }
}
