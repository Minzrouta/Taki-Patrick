import { Component, DestroyRef, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Movie } from '../models/movie';
import { MoviesApi } from '../services/movies-api';
import { AsyncPipe, DatePipe } from '@angular/common';
import { MovieCard } from '../home/movie-card/movie-card';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-movies-list',
  imports: [AsyncPipe, DatePipe, MovieCard, RouterLink, RouterOutlet],
  templateUrl: './movies-list.html',
  styleUrl: './movies-list.scss',
})
export class MoviesList {
  private readonly moviesApi = inject(MoviesApi)
  constructor(private router: Router) { }
  movies: Movie[] = [];
  ngOnInit(): void {
    this.moviesApi.getMovies().subscribe(movies => this.movies = movies);
  }
  private destroyRef = inject(DestroyRef)
  deleteMovie(id: number): void {
    this.moviesApi.deleteMovie(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() =>
      this.movies = this.movies.filter(film => film.id !== id)
    );
  }
}
