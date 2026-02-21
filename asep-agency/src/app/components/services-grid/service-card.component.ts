import { Component, input, output, signal } from '@angular/core';
import { Service } from '../../models/service.model';

@Component({
  selector: 'app-service-card',
  standalone: true,
  templateUrl: './service-card.component.html',
  styleUrl: './service-card.component.css'
})
export class ServiceCardComponent {
  service = input.required<Service>();
  isHighlighted = input(false);
  hovered = output<string | null>();

  isHovered = signal(false);

  onMouseEnter() {
    this.isHovered.set(true);
    this.hovered.emit(this.service().id);
  }

  onMouseLeave() {
    this.isHovered.set(false);
    this.hovered.emit(null);
  }
}

