import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-about',
  standalone: true,
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent {
  values = signal([
    { icon: '✓', title: 'Sélection rigoureuse', desc: 'Chaque candidat passe un processus en 5 étapes : vérification d\'identité, casier judiciaire, références, entretien et période d\'essai.' },
    { icon: '♡', title: 'Suivi personnalisé', desc: 'Un conseiller dédié vous accompagne pour garantir une relation harmonieuse avec votre personnel.' },
    { icon: '⟳', title: 'Remplacement garanti', desc: 'En cas d\'absence ou d\'insatisfaction, nous assurons un remplacement sous 24h, sans frais supplémentaires.' }
  ]);
}

