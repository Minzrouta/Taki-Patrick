import { Component, inject } from '@angular/core';
import { MoviesApi } from '../services/movies-api';
import { Movie } from '../models/movie';
import { Observable } from 'rxjs';
import { ReviewsApi } from '../services/reviews-api';
import { UsersApi } from '../services/user-api';

@Component({
  selector: 'app-panel-admin',
  imports: [],
  templateUrl: './panel-admin.html',
  styleUrl: './panel-admin.scss',
})
export class PanelAdmin {
  private readonly moviesApi = inject(MoviesApi)
  private readonly reviewsApi = inject(ReviewsApi)
  private readonly usersApi = inject(UsersApi)


  movieCount: number = 0   // Movie Count
  reviewCount: number = 0  // Review Count
  userCount: number = 0    // User Count
  totalAverage: number = 0 // Average review of all movies
  bestMovie: number = 0    // Best movie
  worstMovie: number = 0   // Worst movie


  items = [
    { title: 'Nombre de ', bold: 'films', data: this.movieCount },
    { title: 'Nombre d\'', bold: 'avis', data: this.reviewCount },
    { title: 'Nombre d\'', bold: 'utilisateurs', data: this.userCount },
    { title: 'Moyenne de tous les ', bold: 'films', data: this.totalAverage },
    { title: 'Meilleur ', bold: 'film', data: this.bestMovie },
    { title: 'Pire ', bold: 'film', data: this.worstMovie },
  ];

  // Get data on init
  ngOnInit(): void {
    this.moviesApi.getMovies().subscribe(movies => {
      this.movieCount = movies.length
      // let average = 0;

      // movies.forEach(movie => {
      //   this.moviesApi.getMoviesReviews(movie.id!).subscribe(reviews => {
      //     // Compute moyenne de tous les films 
      //     // Meilleur film
      //     // Pire film
      //     average = 0
      //     reviews.forEach(review => {
      //       average += review.rate
      //     });
      //     average /= reviews.length
      //   })
      // });

      movies.forEach(movie => {
        this.totalAverage += movie.rate ? movie.rate : 0;
        if (movie.rate) {
          if (movie.rate > this.bestMovie) {
            this.bestMovie = movie.rate
          }
          else if (movie.rate < this.worstMovie) {
            this.worstMovie = movie.rate
          }
        }
      });
      this.totalAverage /= movies.length;
    });
    this.reviewsApi.getReviews().subscribe(reviews => {
      this.reviewCount = reviews.length
    });
    this.usersApi.getUsers().subscribe(users => {
      this.userCount = users.length
    });


  }
}
