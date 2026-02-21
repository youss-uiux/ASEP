import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-hero',
  standalone: true,
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css'
})
export class HeroComponent {
  stats = signal([
    { value: '500+', label: 'Familles servies' },
    { value: '98%', label: 'Satisfaction' },
    { value: '7j/7', label: 'Disponibilité' }
  ]);
}

