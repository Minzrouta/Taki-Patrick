import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Movie } from '../models/movie';
import { MoviesApi } from '../services/movies-api';
import { Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-movie',
  imports: [ReactiveFormsModule],
  templateUrl: './add-movie.html',
  styleUrl: './add-movie.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddMovie {
  private readonly router = inject(Router);
  private readonly moviesApi = inject(MoviesApi);

  searchControl = new FormControl('');
  searching = signal(false);
  searchError = signal('');
  posterUrl = signal<string | undefined>(undefined);

  movieForm = new FormGroup({
    title:       new FormControl('', [Validators.required]),
    director:    new FormControl('', [Validators.required]),
    releaseDate: new FormControl('', [Validators.required]),
    synopsis:    new FormControl('', [Validators.required]),
  });

  searchMovie(): void {
    const title = this.searchControl.value?.trim();
    if (!title) return;
    this.searching.set(true);
    this.searchError.set('');

    this.moviesApi.searchMovieByTitle(title).subscribe({
      next: (result) => {
        this.movieForm.patchValue({
          title:       result.title,
          director:    result.director ?? '',
          synopsis:    result.synopsis ?? '',
          releaseDate: result.releaseDate
            ? new Date(result.releaseDate).toISOString().split('T')[0]
            : '',
        });
        this.posterUrl.set(result.posterUrl ?? undefined);
        this.searching.set(false);
      },
      error: () => {
        this.searchError.set('Film non trouvé. Remplis les champs manuellement.');
        this.searching.set(false);
      },
    });
  }

  addMovie(): void {
    if (this.movieForm.invalid) return;
    const { title, director, releaseDate, synopsis } = this.movieForm.value;
    const movie: Movie = {
      title:       title!,
      director:    director!,
      releaseDate: new Date(releaseDate!),
      synopsis:    synopsis!,
      image:       this.posterUrl(),
    };
    this.moviesApi.addMovie(movie).subscribe(() => this.router.navigate(['/movies']));
  }
}
