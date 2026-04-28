import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  imports: [CommonModule],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  currentYear = new Date().getFullYear();

  siteMap = [
    { title: 'PARIS',     links: ['Beaugrenelle', 'Champs‑Elysées', 'La Vilette'] },
    { title: 'LYON',      links: ['Vaise', 'Carré de Soie', 'Bellecour'] },
    { title: 'MARSEILLE', links: ['Madeline', 'Plan de campagne', 'La Joliette'] },
    { title: 'NICE',      links: ['Lingostière', 'Masséna', 'Gare du Sud'] }
  ];
}
