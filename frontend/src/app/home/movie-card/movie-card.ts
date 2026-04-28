import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Movie } from '../../models/movie';
import { Review } from '../../models/review';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './movie-card.html',
  styleUrl: './movie-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovieCard {
  @Input({ required: true }) movie!: Movie;
  @Input() existingReview: Review | null = null;
  @Output() openReview = new EventEmitter<void>();

  protected readonly auth = inject(AuthService);
}
