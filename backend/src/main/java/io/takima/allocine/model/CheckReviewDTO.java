package io.takima.allocine.model;

/**
 * DTO pour récupérer des requetes contenant un userID et un filmID
 */
public class CheckReviewDTO {
    private Long userId;
    private Long filmId;

    public CheckReviewDTO() {
    }

    public CheckReviewDTO(Long userId, Long filmId) {
        this.userId = userId;
        this.filmId = filmId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getFilmId() {
        return filmId;
    }

    public void setFilmId(Long filmId) {
        this.filmId = filmId;
    }
}
