import { Component, signal } from '@angular/core';
import { ServiceCardComponent } from './service-card.component';
import { Service } from '../../models/service.model';

@Component({
  selector: 'app-services-grid',
  standalone: true,
  imports: [ServiceCardComponent],
  templateUrl: './services-grid.component.html',
  styleUrl: './services-grid.component.css'
})
export class ServicesGridComponent {
  hoveredService = signal<string | null>(null);

  services = signal<Service[]>([
    {
      id: 'nanny',
      title: 'Nounous',
      description: 'Des professionnelles de la petite enfance, formées et bienveillantes.',
      longDescription: 'Garde à domicile, aide aux devoirs, accompagnement scolaire. Toutes nos nounous sont certifiées et référencées.',
      icon: '👶',
      image: 'https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=800&h=600&fit=crop&crop=faces',
      gridArea: 'nanny',
      color: '#FFE8D6'
    },
    {
      id: 'gardener',
      title: 'Jardiniers',
      description: 'Des artisans du vert pour un extérieur impeccable.',
      longDescription: 'Entretien de pelouse, taille de haies, aménagement paysager, potager bio. Des experts passionnés par la nature.',
      icon: '🌿',
      image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=600&fit=crop',
      gridArea: 'gardener',
      color: '#D4EDDA'
    },
    {
      id: 'guard',
      title: 'Gardiens',
      description: 'Sécurité et tranquillité d\'esprit pour votre propriété.',
      longDescription: 'Surveillance de résidence, rondes régulières, gestion des accès. Personnel formé à la sécurité privée.',
      icon: '🛡️',
      image: 'https://images.unsplash.com/photo-1521791055366-0d553872125f?w=800&h=600&fit=crop',
      gridArea: 'guard',
      color: '#D6E4FF'
    }
  ]);

  onServiceHover(serviceId: string | null) {
    this.hoveredService.set(serviceId);
  }
}

