import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, OnInit, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Movie } from '../models/movie';
import { Review } from '../models/review';
import { User } from '../models/user';
import { ReviewsApi } from '../services/reviews-api';

@Component({
  selector: 'app-review-modal',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './review-modal.html',
  styleUrl: './review-modal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewModal implements OnInit {
  @Input({ required: true }) movie!: Movie;
  @Input({ required: true }) currentUser!: User;
  @Input() existingReview: Review | null = null;
  @Output() reviewed = new EventEmitter<void>();
  @Output() closed = new EventEmitter<void>();

  private readonly reviewsApi = inject(ReviewsApi);

  selectedRate = signal(0);
  hoveredRate = signal(0);
  comment = signal('');
  submitting = signal(false);

  readonly stars = [1, 2, 3, 4, 5];

  ngOnInit(): void {
    if (this.existingReview) {
      this.selectedRate.set(this.existingReview.rate);
      this.comment.set(this.existingReview.text ?? '');
    }
  }

  displayRate(): number {
    return this.hoveredRate() || this.selectedRate();
  }

  starIcon(position: number, half: boolean): string {
    const rate = this.displayRate();
    const threshold = half ? position - 0.5 : position;
    if (rate >= position) return 'bi-star-fill';
    if (rate >= threshold) return 'bi-star-half';
    return 'bi-star';
  }

  setRate(value: number): void {
    this.selectedRate.set(value);
  }

  submit(): void {
    if (this.selectedRate() === 0 || this.submitting()) return;
    this.submitting.set(true);

    const payload: Partial<Review> = {
      rate: this.selectedRate(),
      text: this.comment(),
      user: this.currentUser,
      movie: this.movie,
      reviewDate: new Date(),
    };

    const request$ = this.existingReview
      ? this.reviewsApi.updateReview(this.existingReview.id!, payload)
      : this.reviewsApi.addReview(payload);

    request$.subscribe({
      next: () => {
        this.submitting.set(false);
        this.reviewed.emit();
      },
      error: () => this.submitting.set(false),
    });
  }
}
