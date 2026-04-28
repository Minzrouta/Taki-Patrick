import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Review } from '../models/review';

@Injectable({ providedIn: 'root' })
export class ReviewsApi {
  private readonly http = inject(HttpClient);
  private readonly url = '/reviews';

  getReviews(): Observable<Review[]> {
    return this.http.get<Review[]>(this.url);
  }

  getReviewsByUser(userId: number): Observable<Review[]> {
    return this.http.get<Review[]>(`/users/${userId}/reviews`);
  }

  getReviewsByMovie(movieId: number): Observable<Review[]> {
    return this.http.get<Review[]>(`/movies/${movieId}/reviews`);
  }

  checkReview(userId: number, filmId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.url}/checkAvis`, {
      params: { userId: userId.toString(), filmId: filmId.toString() },
    });
  }

  addReview(review: Partial<Review>): Observable<Review> {
    return this.http.post<Review>(this.url, review);
  }

  updateReview(id: number, review: Partial<Review>): Observable<Review> {
    return this.http.put<Review>(`${this.url}/${id}`, review);
  }

  deleteReview(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
