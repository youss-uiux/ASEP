import { Component, signal, computed } from '@angular/core';
import { StepServiceComponent } from './step-service.component';
import { StepDetailsComponent } from './step-details.component';
import { StepConfirmComponent } from './step-confirm.component';
import { OrderRequest } from '../../models/service.model';

@Component({
  selector: 'app-order-form',
  standalone: true,
  imports: [StepServiceComponent, StepDetailsComponent, StepConfirmComponent],
  templateUrl: './order-form.component.html',
  styleUrl: './order-form.component.css'
})
export class OrderFormComponent {
  currentStep = signal(1);
  isSubmitted = signal(false);

  formData = signal<OrderRequest>({
    service: '',
    fullName: '',
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

  onServiceSelected(service: string) {
    this.formData.update(d => ({ ...d, service }));
    this.currentStep.set(2);
  }

  onDetailsSubmitted(details: Partial<OrderRequest>) {
    this.formData.update(d => ({ ...d, ...details }));
    this.currentStep.set(3);
  }

  onConfirmed() {
    this.isSubmitted.set(true);
  }

  goToStep(step: number) {
    if (step < this.currentStep()) {
      this.currentStep.set(step);
    }
  }

  reset() {
    this.currentStep.set(1);
    this.isSubmitted.set(false);
    this.formData.set({
      service: '',
      fullName: '',
      email: '',
      phone: '',
      address: '',
      date: '',
      duration: '',
      notes: ''
    });
  }
}

