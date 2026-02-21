import { Component, input, output, signal } from '@angular/core';

@Component({
  selector: 'app-step-service',
  standalone: true,
  templateUrl: './step-service.component.html',
  styleUrl: './step-service.component.css'
})
export class StepServiceComponent {
  selectedService = input('');
  serviceChosen = output<string>();

  hoveredCard = signal<string | null>(null);

  services = signal([
    {
      id: 'nanny',
      title: 'Nounou',
      icon: '👶',
      desc: 'Garde d\'enfants et aide à la maison',
      features: ['Garde jour & nuit', 'Aide aux devoirs', 'Activités éducatives']
    },
    {
      id: 'gardener',
      title: 'Jardinier',
      icon: '🌿',
      desc: 'Entretien et aménagement d\'espaces verts',
      features: ['Tonte & taille', 'Aménagement paysager', 'Potager bio']
    },
    {
      id: 'guard',
      title: 'Gardien',
      icon: '🛡️',
      desc: 'Surveillance et sécurité de votre propriété',
      features: ['Rondes régulières', 'Gestion des accès', 'Surveillance 24/7']
    }
  ]);

  selectService(id: string) {
    this.serviceChosen.emit(id);
  }
}

