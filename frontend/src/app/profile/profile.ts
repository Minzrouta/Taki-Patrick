import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { of, switchMap } from 'rxjs';
import { Review } from '../models/review';
import { User } from '../models/user';
import { AuthService } from '../services/auth.service';
import { ReviewsApi } from '../services/reviews-api';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfilePage implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly reviewsApi = inject(ReviewsApi);
  // inject DestroyRef in injection context, pass to takeUntilDestroyed inside pipe
  private readonly destroyRef = inject(DestroyRef);

  user = signal<User | null>(null);
  reviews = signal<Review[]>([]);
  loading = signal(true);
  readonly stars = [1, 2, 3, 4, 5];

  ngOnInit(): void {
    this.auth.currentUser$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        switchMap((u) => {
          this.user.set(u);
          this.loading.set(true);
          return u?.id ? this.reviewsApi.getReviewsByUser(u.id) : of<Review[]>([]);
        }),
      )
      .subscribe({
        next: (reviews) => {
          this.reviews.set(reviews);
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });
  }
}
