import { Component, signal, computed, inject, effect } from '@angular/core';
import { StepServiceComponent } from './step-service.component';
import { StepDetailsComponent } from './step-details.component';
import { StepConfirmComponent } from './step-confirm.component';
import { OrderRequest } from '../../models/service.model';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-order-form',
  standalone: true,
  imports: [StepServiceComponent, StepDetailsComponent, StepConfirmComponent],
  templateUrl: './order-form.component.html',
  styleUrl: './order-form.component.css'
})
export class OrderFormComponent {
  private supabaseService = inject(SupabaseService);

  currentStep = signal(1);
  isSubmitted = signal(false);

  /** Message animé de succès / erreur */
  successMessage = signal<string | null>(null);
  errorMessage = signal<string | null>(null);

  /** Signals exposés depuis le service */
  isSubmitting = this.supabaseService.isSubmitting;

  formData = signal<OrderRequest>({
    service_slug: '',
    service_id: '',
    client_type: 'particulier',
    fullName: '',
    company: '',
    email: '',
    phone: '',
    address: '',
    date: '',
    duration: '',
    notes: ''
  });

  stepProgress = computed(() => (this.currentStep() / 3) * 100);

  steps = signal([
    { number: 1, label: 'Service' },
    { number: 2, label: 'Détails' },
    { number: 3, label: 'Confirmation' }
  ]);

  constructor() {
    // Réagit aux changements d'état du service Supabase
    effect(() => {
      const state = this.supabaseService.submissionState();

      if (state === 'success') {
        this.isSubmitted.set(true);
        this.successMessage.set('Votre demande a été enregistrée avec succès !');
        this.errorMessage.set(null);
      }

      if (state === 'error') {
        this.errorMessage.set(
          this.supabaseService.errorMessage() ??
          'Une erreur est survenue. Veuillez réessayer.'
        );
        this.successMessage.set(null);
      }
    });
  }

  onServiceSelected(service: { slug: string; id: string }) {
    this.formData.update(d => ({ ...d, service_slug: service.slug, service_id: service.id }));
    this.currentStep.set(2);
  }

  onDetailsSubmitted(details: Partial<OrderRequest>) {
    this.formData.update(d => ({ ...d, ...details }));
    this.currentStep.set(3);
  }

  async onConfirmed() {
    await this.supabaseService.insertLead(this.formData());
  }

  goToStep(step: number) {
    if (step < this.currentStep()) {
      this.currentStep.set(step);
    }
  }

  reset() {
    this.currentStep.set(1);
    this.isSubmitted.set(false);
    this.successMessage.set(null);
    this.errorMessage.set(null);
    this.supabaseService.resetState();
    this.formData.set({
      service_slug: '',
      service_id: '',
      client_type: 'particulier',
      fullName: '',
      company: '',
      email: '',
      phone: '',
      address: '',
      date: '',
      duration: '',
      notes: ''
    });
  }
}

