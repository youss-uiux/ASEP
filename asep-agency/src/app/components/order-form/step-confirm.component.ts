import { Component, input, output, computed } from '@angular/core';
import { OrderRequest } from '../../models/service.model';

@Component({
  selector: 'app-step-confirm',
  standalone: true,
  templateUrl: './step-confirm.component.html',
  styleUrl: './step-confirm.component.css'
})
export class StepConfirmComponent {
  formData = input.required<OrderRequest>();
  confirmed = output<void>();
  goBack = output<void>();

  serviceLabels: Record<string, string> = {
    nanny: '👶 Nounou',
    gardener: '🌿 Jardinier',
    guard: '🛡️ Gardien'
  };

  durationLabels: Record<string, string> = {
    ponctuel: 'Ponctuel (1 jour)',
    semaine: '1 Semaine',
    mois: '1 Mois',
    trimestre: '3 Mois',
    permanent: 'Permanent'
  };

  serviceLabel = computed(() => this.serviceLabels[this.formData().service] || this.formData().service);
  durationLabel = computed(() => this.durationLabels[this.formData().duration] || this.formData().duration);

  confirm() {
    this.confirmed.emit();
  }

  back() {
    this.goBack.emit();
  }
}

