import { Component, inject, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Movie } from '../models/movie';
import { MoviesApi } from '../services/movies-api';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-edit-movie',
  imports: [FormsModule],
  templateUrl: './edit-movie.html',
  styleUrl: './edit-movie.scss',
})
export class EditMovie {
  constructor(private router: Router) { }
  private route = inject(ActivatedRoute);
  id = this.route.snapshot.params['id'];
  private readonly moviesApi = inject(MoviesApi);
  editedMovie: Movie = {
    title: '',
    director: '',
    releaseDate: new Date(),
    synopsis: '',
    id: undefined,
    rate: undefined,
    image: undefined
  }
  ngOnInit(): void {
    this.moviesApi.getMovie(this.id).subscribe(movie => {
      this.editedMovie = {
        title: movie.title,
        director: movie.director,
        releaseDate: new Date(movie.releaseDate).toISOString().substring(0, 10) as any,
        synopsis: movie.synopsis,
        id: movie.id,
        rate: undefined,
        image: undefined
      };
    });
  }
  editMovie(id: number | undefined): void {
    if (id != undefined) {
      this.moviesApi.editMovie(id, this.editedMovie).subscribe(() =>
        this.router.navigate(['/movies'])
      );
    }
    else {
      this.router.navigate(['/movies']);
    }
  }
}
