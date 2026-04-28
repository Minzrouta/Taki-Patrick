import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
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

  user = signal<User | null>(null);
  reviews = signal<Review[]>([]);
  loading = signal(true);

  ngOnInit(): void {
    this.auth.currentUser$.subscribe((u) => {
      this.user.set(u);
      if (u?.id) {
        this.reviewsApi.getReviewsByUser(u.id).subscribe((reviews) => {
          this.reviews.set(reviews);
          this.loading.set(false);
        });
      } else {
        this.loading.set(false);
      }
    });
  }
}
