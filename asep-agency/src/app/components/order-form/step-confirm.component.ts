import { Component, input, output, computed, inject } from '@angular/core';
import { OrderRequest } from '../../models/service.model';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-step-confirm',
  standalone: true,
  templateUrl: './step-confirm.component.html',
  styleUrl: './step-confirm.component.css'
})
export class StepConfirmComponent {
  formData = input.required<OrderRequest>();
  isSubmitting = input(false);
  confirmed = output<void>();
  goBack = output<void>();

  private supabaseService = inject(SupabaseService);

  durationLabels: Record<string, string> = {
    ponctuel: 'Ponctuel (1 jour)',
    semaine: '1 Semaine',
    mois: '1 Mois',
    trimestre: '3 Mois',
    permanent: 'Permanent'
  };

  clientTypeLabels: Record<string, string> = {
    particulier: 'Particulier',
    entreprise: 'Entreprise',
    institution: 'Institution'
  };

  serviceLabel = computed(() => this.supabaseService.getServiceLabel(this.formData().service_slug));
  durationLabel = computed(() => this.durationLabels[this.formData().duration] || this.formData().duration);
  clientTypeLabel = computed(() => this.clientTypeLabels[this.formData().client_type] || this.formData().client_type);

  confirm() { this.confirmed.emit(); }
  back() { this.goBack.emit(); }
}
