import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-about',
  standalone: true,
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent {
  values = signal([
    {
      icon: '✓',
      title: 'Professionnalisme',
      desc: 'Un service conforme aux normes et aux attentes de chaque client, qu\'il soit particulier, entreprise ou institution.'
    },
    {
      icon: '♡',
      title: 'Rigueur & Fiabilité',
      desc: 'Application stricte des procédures et délais établis. Une confiance bâtie dans la durée.'
    },
    {
      icon: '⟳',
      title: 'Innovation & Discipline',
      desc: 'Anticipation des besoins, intégration de solutions modernes, ponctualité et cohérence dans chaque prestation.'
    },
    {
      icon: '★',
      title: 'Engagement Social',
      desc: 'Contribution active à la promotion de l\'emploi, à la professionnalisation des métiers et au développement local au Niger.'
    }
  ]);
}
