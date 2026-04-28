import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Review } from '../models/review';

@Injectable({
  providedIn: 'root',
})
export class ReviewsApi {
  private readonly httpClient = inject(HttpClient)
  private readonly url = "/reviews"
  getReviews(): Observable<Review[]> {
    return this.httpClient.get<Review[]>(this.url);
  }
  // addMovie(movie: Movie): Observable<Movie> {
  //   return this.httpClient.post<Movie>(this.url, movie);
  // }
  // deleteMovie(id: number): Observable<void> {
  //   return this.httpClient.delete<void>(`${this.url}/${id}`);
  // }
  // editMovie(id: number, movie: Movie): Observable<void> {
  //   return this.httpClient.put<void>(`${this.url}/${id}`, movie);
  // }
  // getMovie(id: number): Observable<Movie> {
  //   return this.httpClient.get<Movie>(`${this.url}/${id}`);
  // }
}
