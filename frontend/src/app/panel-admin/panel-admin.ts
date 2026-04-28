import { Component, inject } from '@angular/core';
import { MoviesApi } from '../services/movies-api';
import { ReviewsApi } from '../services/reviews-api';
import { UsersApi } from '../services/user-api';
import { StatsCard } from './stats-card/stats-card';
import { Stats } from '../models/stats';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-panel-admin',
  imports: [StatsCard, RouterLink],
  templateUrl: './panel-admin.html',
  styleUrl: './panel-admin.scss',
})
export class PanelAdmin {
  private readonly moviesApi = inject(MoviesApi)
  private readonly reviewsApi = inject(ReviewsApi)
  private readonly usersApi = inject(UsersApi)

  items: Stats[] = [];
  // Get data on init
  ngOnInit(): void {
    forkJoin({
      movies: this.moviesApi.getMovies(),
      reviews: this.reviewsApi.getReviews(),
      users: this.usersApi.getUsers(),
    }).subscribe(({ movies, reviews, users }) => {
      let totalAverage = 0;
      let bestMovie = '';
      let worstMovie = '';
      let best = 0;
      let worst = 5;

      movies.forEach(movie => {
        totalAverage += movie.rate ?? 0;
        if (movie.rate) {
          if (movie.rate > best) { best = movie.rate; bestMovie = movie.title; }
          if (movie.rate < worst) { worst = movie.rate; worstMovie = movie.title; }
        }
      });

      totalAverage /= movies.length;

      this.items = [
        { title: 'Nombre de ', bold: 'films', data: movies.length },
        { title: 'Nombre d\'', bold: 'avis', data: reviews.length },
        { title: 'Nombre d\'', bold: 'utilisateurs', data: users.length },
        { title: 'Moyenne de tous les ', bold: 'films', data: totalAverage.toFixed(2) },
        { title: 'Meilleur ', bold: 'film', data: bestMovie },
        { title: 'Pire ', bold: 'film', data: worstMovie },
      ];
    });
  }
}
