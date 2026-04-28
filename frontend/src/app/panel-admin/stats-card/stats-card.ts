import { Component, Input } from '@angular/core';
import { Stats } from '../../models/stats';

@Component({
  selector: 'app-stats-card',
  imports: [],
  templateUrl: './stats-card.html',
  styleUrl: './stats-card.scss',
})
export class StatsCard {
  @Input({ required: true }) stat!: Stats
}
