import { ChangeDetectionStrategy, Component, inject, Input, OnInit, signal } from '@angular/core';
import { Movie } from '../../models/movie';
import { Review } from '../../models/review';
import { AuthService } from '../../services/auth.service';
import { ReviewsApi } from '../../services/reviews-api';
import { ReviewModal } from '../../review-modal/review-modal';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [ReviewModal, AsyncPipe],
  templateUrl: './movie-card.html',
  styleUrl: './movie-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovieCard implements OnInit {
  @Input({ required: true }) movie!: Movie;

  protected readonly auth = inject(AuthService);
  private readonly reviewsApi = inject(ReviewsApi);

  showModal = signal(false);
  existingReview = signal<Review | null>(null);

  ngOnInit(): void {
    this.auth.currentUser$.subscribe((user) => {
      if (user && this.movie.id) {
        this.reviewsApi.getReviewsByMovie(this.movie.id).subscribe((reviews) => {
          const mine = reviews.find((r) => r.user?.id === user.id) ?? null;
          this.existingReview.set(mine);
        });
      }
    });
  }

  onReviewed(): void {
    this.showModal.set(false);
    const user = this.auth.currentUser;
    if (user && this.movie.id) {
      this.reviewsApi.getReviewsByMovie(this.movie.id).subscribe((reviews) => {
        const mine = reviews.find((r) => r.user?.id === user.id) ?? null;
        this.existingReview.set(mine);
      });
    }
  }
}
