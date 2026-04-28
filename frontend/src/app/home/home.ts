import { MoviesApi } from '../services/movies-api';
import { Observable } from 'rxjs';
import { Movie } from '../models/movie';
import { AsyncPipe, DatePipe } from '@angular/common';
import { MovieCard } from './movie-card/movie-card';

import { Component, OnInit, inject, signal } from '@angular/core';
import { CarouselModule } from 'primeng/carousel';
import { toSignal } from '@angular/core/rxjs-interop';


@Component({
  selector: 'app-home',
  imports: [AsyncPipe, DatePipe, MovieCard, CarouselModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  standalone: true,

})
export class Home {
  private readonly moviesApi = inject(MoviesApi)
  movies: Movie[] = [];

  responsiveOptions: any[] | undefined;
  ngOnInit() {
    this.moviesApi.getMovies().subscribe(movies => {
      this.movies = movies;
    });
    this.responsiveOptions = [
      {
        breakpoint: '1400px',
        numVisible: 2,
        numScroll: 1
      },
      {
        breakpoint: '1199px',
        numVisible: 3,
        numScroll: 1
      },
      {
        breakpoint: '767px',
        numVisible: 2,
        numScroll: 1
      },
      {
        breakpoint: '575px',
        numVisible: 1,
        numScroll: 1
      }
    ];
  }
}
