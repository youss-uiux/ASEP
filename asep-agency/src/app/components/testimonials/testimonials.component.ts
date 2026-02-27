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
      name: 'Aminatou Boubacar',
      role: 'Directrice RH, Société Minière du Niger',
      content: 'ASEP nous fournit du personnel temporaire qualifié depuis 2 ans. Leur rigueur dans la sélection et le suivi est exemplaire. Un vrai partenaire RH.',
      avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=120&h=120&fit=crop&crop=faces',
      rating: 5
    },
    {
      id: 2,
      name: 'Ibrahim Moussa',
      role: 'Gérant, Hôtel Sahel Niamey',
      content: 'Du nettoyage à la sécurité, ASEP gère l\'intégralité de nos besoins multiservices. Ponctualité, discrétion et qualité constante.',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&h=120&fit=crop&crop=faces',
      rating: 5
    },
    {
      id: 3,
      name: 'Fatima Issa',
      role: 'Organisatrice d\'événements, Niamey',
      content: 'Le service traiteur et l\'organisation de notre conférence annuelle étaient impeccables. Professionnalisme du début à la fin.',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&h=120&fit=crop&crop=faces',
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

