import { Component, DestroyRef, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Movie } from '../models/movie';
import { MoviesApi } from '../services/movies-api';
import { AsyncPipe, DatePipe } from '@angular/common';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-movies-list',
  imports: [AsyncPipe, DatePipe, RouterLink, RouterOutlet],
  templateUrl: './movies-list.html',
  styleUrl: './movies-list.scss',
})
export class MoviesList {
  private router = inject(Router);
  private readonly moviesApi = inject(MoviesApi)
  private toasterService = inject(ToastrService);

  movies: Movie[] = [];
  ngOnInit(): void {
    this.moviesApi.getMovies().subscribe(movies => this.movies = movies);
  }

  private destroyRef = inject(DestroyRef)
  deleteMovie(id: number): void {
    this.moviesApi.deleteMovie(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() =>
      {
        this.movies = this.movies.filter(film => film.id !== id);
        this.toasterService.success('Film supprimé avec succès !')
      }
    );
  }
}
