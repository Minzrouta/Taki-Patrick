import { Component, inject } from '@angular/core';
import { Movie } from '../models/movie';
import { FormsModule } from '@angular/forms';
import { MoviesApi } from '../services/movies-api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-movie',
  imports: [FormsModule],
  templateUrl: './add-movie.html',
  styleUrl: './add-movie.scss',
})
export class AddMovie {
  constructor(private router: Router) {}

  movie: Movie = {
    title: '',
    director: '',
    releaseDate: new Date(),
    synopsis: '',
    id: undefined,
    rate: undefined,
    image: undefined,
  };

  searchTitle = '';
  searching = false;
  searchError = '';
  selectedFile: File | null = null;
  previewUrl: string | null = null;

  private readonly moviesApi = inject(MoviesApi);

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedFile = input.files[0];
      this.previewUrl = URL.createObjectURL(this.selectedFile);
    }
  }

  searchMovie(): void {
    if (!this.searchTitle.trim()) return;
    this.searching = true;
    this.searchError = '';

    this.moviesApi.searchMovieByTitle(this.searchTitle).subscribe({
      next: (result) => {
        this.movie.title = result.title;
        this.movie.director = result.director ?? '';
        this.movie.synopsis = result.synopsis ?? '';
        this.movie.releaseDate = result.releaseDate ? new Date(result.releaseDate) : new Date();
        this.previewUrl = result.posterUrl ?? null;
        this.movie.image = undefined;
        this.searching = false;
      },
      error: () => {
        this.searchError = 'Film non trouvé. Remplis les champs manuellement.';
        this.searching = false;
      },
    });
  }

  addMovie(): void {
    this.moviesApi.addMovie(this.movie).subscribe((created) => {
      if (this.selectedFile && created.id) {
        this.moviesApi.uploadImage(created.id, this.selectedFile).subscribe(() =>
          this.router.navigate(['/movies'])
        );
      } else {
        this.router.navigate(['/movies']);
      }
    });
  }
}
