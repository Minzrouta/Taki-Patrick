import { Component, inject, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Movie } from '../models/movie';
import { MoviesApi } from '../services/movies-api';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-movie',
  imports: [FormsModule],
  templateUrl: './edit-movie.html',
  styleUrl: './edit-movie.scss',
})
export class EditMovie {
  private router = inject(Router);
  private toasterService = inject(ToastrService);
  private route = inject(ActivatedRoute);

  id = this.route.snapshot.params['id'];
  private readonly moviesApi = inject(MoviesApi);
  selectedFile: File | null = null;

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
        image: movie.image
      };
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedFile = input.files[0];
    }
  }

  editMovie(id: number | undefined): void {
    if (id == undefined) {
      this.toasterService.error('Erreur lors de la mise à jour');
      this.router.navigate(['/movies']);
      return;
    }
    this.moviesApi.editMovie(id, this.editedMovie).subscribe(() => {
      if (this.selectedFile) {
        this.moviesApi.uploadImage(id, this.selectedFile).subscribe(() =>
          {
            this.toasterService.success('Film mis à jour avec succès !')
            this.router.navigate(['/movies'])
          }
        );
      } else {
        this.toasterService.error('Aucune image sélectionnée')
        this.router.navigate(['/movies']);
      }
    });
  }
}
