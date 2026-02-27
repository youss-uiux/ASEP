import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-hero',
  standalone: true,
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css'
})
export class HeroComponent {
  stats = signal([
    { value: '500+', label: 'Clients satisfaits' },
    { value: '10', label: 'Secteurs d\'activité' },
    { value: '7j/7', label: 'Réactivité' }
  ]);
}

