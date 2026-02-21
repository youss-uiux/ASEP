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
    { label: 'Services', href: '#services' },
    { label: 'À Propos', href: '#about' },
    { label: 'Témoignages', href: '#testimonials' },
    { label: 'Réserver', href: '#order' }
  ]);

  services = signal([
    { label: 'Nounous', href: '#order' },
    { label: 'Jardiniers', href: '#order' },
    { label: 'Gardiens', href: '#order' }
  ]);
}

