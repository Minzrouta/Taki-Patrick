import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Movie } from '../models/movie';
import { MovieSearchResult } from '../models/movie-search-result';
import { MovieSuggestion } from '../models/movie-suggestion';

@Injectable({
  providedIn: 'root',
})
export class MoviesApi {
  private readonly httpClient = inject(HttpClient)
  private readonly url = "http://localhost:8080/movies"
  getMovies(): Observable<Movie[]> {
    return this.httpClient.get<Movie[]>(this.url);
  }
  addMovie(movie: Movie): Observable<Movie> {
    return this.httpClient.post<Movie>(this.url, movie);
  }
  deleteMovie(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.url}/${id}`);
  }
  editMovie(id: number, movie: Movie): Observable<void> {
    return this.httpClient.put<void>(`${this.url}/${id}`, movie);
  }
  getMovie(id: number): Observable<Movie> {
    return this.httpClient.get<Movie>(`${this.url}/${id}`);
  }

  searchMovieByTitle(title: string): Observable<MovieSearchResult> {
    return this.httpClient.get<MovieSearchResult>(`${this.url}/search`, { params: { title } });
  }

  getSuggestions(query: string): Observable<MovieSuggestion[]> {
    return this.httpClient.get<MovieSuggestion[]>(`${this.url}/suggestions`, { params: { query } });
  }

  getPopularMovies(): Observable<MovieSuggestion[]> {
    return this.httpClient.get<MovieSuggestion[]>(`${this.url}/popular`);
  }

  getMovieByTmdbId(tmdbId: number): Observable<MovieSearchResult> {
    return this.httpClient.get<MovieSearchResult>(`${this.url}/tmdb/${tmdbId}`);
  }
}
