import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  currentYear = signal(new Date().getFullYear());

  quickLinks = signal([
    { label: 'Secteurs d\'activité', href: '#services' },
    { label: 'Le Groupe', href: '#about' },
    { label: 'Témoignages', href: '#testimonials' },
    { label: 'Demander un devis', href: '#order' }
  ]);

  services = signal([
    { label: 'Personnel & RH', href: '#order' },
    { label: 'Hygiène & Assainissement', href: '#order' },
    { label: 'Multiservices Techniques', href: '#order' },
    { label: 'Gardiennage & Sécurité', href: '#order' },
    { label: 'Voir tous les secteurs', href: '#services' }
  ]);
}

