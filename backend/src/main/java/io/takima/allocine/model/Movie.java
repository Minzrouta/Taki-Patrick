package io.takima.allocine.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import java.util.Date;
import java.util.List;

@Entity(name = "movie")
public class Movie {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @OneToMany(mappedBy = "movie", orphanRemoval = true, cascade = CascadeType.REMOVE)
    @JsonIgnore
    private List<Review> reviews;
    @Column(name = "title")
    private String title;
    @Column(name = "director")
    private String director;
    @Column(name = "rate")
    private Float rate;
    @Column(name = "release_date")
    private Date releaseDate;
    @Column(name = "synopsis")
    private String synopsis;
    @Column(name = "image")
    private String image;

    public Movie(Long id, String title, String director, Float rate, Date releaseDate, String synopsis) {
        this.id = id;
        this.title = title;
        this.director = director;
        this.rate = rate;
        this.releaseDate = releaseDate;
        this.synopsis = synopsis;
    }

    public Movie() {

    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setDirector(String director) {
        this.director = director;
    }

    public void setRate(Float rate) {
        this.rate = rate;
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getDirector() {
        return director;
    }

    public Float getRate() {
        return rate;
    }

    public Date getReleaseDate() {
        return releaseDate;
    }

    public void setReleaseDate(Date releaseDate) {
        this.releaseDate = releaseDate;
    }

    public String getSynopsis() {
        return synopsis;
    }

    public void setSynopsis(String synopsis) {
        this.synopsis = synopsis;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {

        this.image = image;
    }

    @Override
    public String toString() {
        return "Film{" +
                "id=" + id +
                ", avis=" + reviews +
                ", title='" + title + '\'' +
                ", director='" + director + '\'' +
                ", rate=" + rate +
                ", releaseDate=" + releaseDate +
                ", synopsis='" + synopsis + '\'' +
                ", image='" + image + '\'' +
                '}';
    }
}
