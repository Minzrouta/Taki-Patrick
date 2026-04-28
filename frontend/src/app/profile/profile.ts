import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { combineLatest, of, switchMap } from 'rxjs';
import { Review } from '../models/review';
import { User } from '../models/user';
import { AuthService } from '../services/auth.service';
import { ReviewsApi } from '../services/reviews-api';
import { UsersApi } from '../services/user-api';

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
  private readonly usersApi = inject(UsersApi);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  user = signal<User | null>(null);
  reviews = signal<Review[]>([]);
  loading = signal(true);
  isOwnProfile = signal(true);
  readonly stars = [1, 2, 3, 4, 5];

  ngOnInit(): void {
    combineLatest([this.route.params, this.auth.currentUser$])
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        switchMap(([params, currentUser]) => {
          const routeId = params['id'] ? Number(params['id']) : null;
          const targetId = routeId ?? currentUser?.id ?? null;
          this.isOwnProfile.set(!routeId || routeId === currentUser?.id);
          this.loading.set(true);

          if (!targetId) return of({ user: null, reviews: [] as Review[] });

          const user$ = routeId && routeId !== currentUser?.id
            ? this.usersApi.getUserById(targetId)
            : of(currentUser);

          return combineLatest([user$, this.reviewsApi.getReviewsByUser(targetId)]).pipe(
            switchMap(([u, reviews]) => of({ user: u, reviews })),
          );
        }),
      )
      .subscribe({
        next: ({ user, reviews }) => {
          this.user.set(user);
          this.reviews.set(reviews);
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });
  }
}
