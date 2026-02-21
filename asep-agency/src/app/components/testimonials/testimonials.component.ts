import { Component, signal, computed } from '@angular/core';
import { Testimonial } from '../../models/service.model';

@Component({
  selector: 'app-testimonials',
  standalone: true,
  templateUrl: './testimonials.component.html',
  styleUrl: './testimonials.component.css'
})
export class TestimonialsComponent {
  activeIndex = signal(0);

  testimonials = signal<Testimonial[]>([
    {
      id: 1,
      name: 'Marie Dupont',
      role: 'Mère de famille, Kinshasa',
      content: 'Notre nounou Esther est devenue un membre de la famille. Les enfants l\'adorent et nous avons totalement confiance. ASEP a su comprendre exactement nos besoins.',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&crop=faces',
      rating: 5
    },
    {
      id: 2,
      name: 'Jean-Pierre Kabongo',
      role: 'Propriétaire, Lubumbashi',
      content: 'Le jardinier que ASEP nous a envoyé a complètement transformé notre extérieur. Ponctuel, créatif et très professionnel. Je recommande sans hésiter.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=faces',
      rating: 5
    },
    {
      id: 3,
      name: 'Cécile Mwamba',
      role: 'Directrice d\'entreprise, Kinshasa',
      content: 'La sécurité de notre résidence est assurée par un gardien ASEP depuis 2 ans. Fiable, discret et toujours vigilant. Un service premium qui vaut chaque centime.',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&h=120&fit=crop&crop=faces',
      rating: 5
    }
  ]);

  currentTestimonial = computed(() => this.testimonials()[this.activeIndex()]);

  starsArray = computed(() => Array.from({ length: this.currentTestimonial().rating }, (_, i) => i));

  next() {
    this.activeIndex.update(i => (i + 1) % this.testimonials().length);
  }

  prev() {
    this.activeIndex.update(i => (i - 1 + this.testimonials().length) % this.testimonials().length);
  }

  goTo(index: number) {
    this.activeIndex.set(index);
  }
}

