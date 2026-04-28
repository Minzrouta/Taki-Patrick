import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { switchMap, of } from 'rxjs';
import { CarouselModule } from 'primeng/carousel';
import { Movie } from '../models/movie';
import { Review } from '../models/review';
import { User } from '../models/user';
import { MoviesApi } from '../services/movies-api';
import { ReviewsApi } from '../services/reviews-api';
import { AuthService } from '../services/auth.service';
import { MovieCard } from './movie-card/movie-card';
import { ReviewModal } from '../review-modal/review-modal';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [AsyncPipe, MovieCard, CarouselModule, ReviewModal],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  private readonly moviesApi = inject(MoviesApi);
  private readonly reviewsApi = inject(ReviewsApi);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly auth = inject(AuthService);

  movies: Movie[] = [];
  reviewMap = signal<Record<number, Review>>({});
  pendingMovie = signal<Movie | null>(null);

  responsiveOptions: any[] | undefined;

  constructor() {
    this.auth.currentUser$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        switchMap((u: User | null) => (u?.id ? this.reviewsApi.getReviewsByUser(u.id) : of([]))),
      )
      .subscribe((reviews) => {
        const map: Record<number, Review> = {};
        reviews.forEach((r) => { if (r.movie?.id) map[r.movie.id] = r; });
        this.reviewMap.set(map);
      });
  }

  ngOnInit(): void {
    this.moviesApi.getMovies().subscribe((movies) => { this.movies = movies; });
    this.responsiveOptions = [
      { breakpoint: '1400px', numVisible: 2, numScroll: 1 },
      { breakpoint: '1199px', numVisible: 3, numScroll: 1 },
      { breakpoint: '767px',  numVisible: 2, numScroll: 1 },
      { breakpoint: '575px',  numVisible: 1, numScroll: 1 },
    ];
  }

  onOpenReview(movie: Movie): void {
    this.pendingMovie.set(movie);
  }

  onReviewed(): void {
    this.pendingMovie.set(null);
    const user = this.auth.currentUser;
    if (user?.id) {
      this.reviewsApi.getReviewsByUser(user.id).subscribe((reviews) => {
        const map: Record<number, Review> = {};
        reviews.forEach((r) => { if (r.movie?.id) map[r.movie.id] = r; });
        this.reviewMap.set(map);
      });
    }
  }
}
