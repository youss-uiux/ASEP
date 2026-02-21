import { Component, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { OrderRequest } from '../../models/service.model';

@Component({
  selector: 'app-step-details',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './step-details.component.html',
  styleUrl: './step-details.component.css'
})
export class StepDetailsComponent {
  formData = input.required<OrderRequest>();
  detailsSubmitted = output<Partial<OrderRequest>>();
  goBack = output<void>();

  fullName = signal('');
  email = signal('');
  phone = signal('');
  address = signal('');
  date = signal('');
  duration = signal('');
  notes = signal('');

  durations = signal([
    { value: 'ponctuel', label: 'Ponctuel (1 jour)' },
    { value: 'semaine', label: '1 Semaine' },
    { value: 'mois', label: '1 Mois' },
    { value: 'trimestre', label: '3 Mois' },
    { value: 'permanent', label: 'Permanent' }
  ]);

  ngOnInit() {
    const data = this.formData();
    if (data.fullName) this.fullName.set(data.fullName);
    if (data.email) this.email.set(data.email);
    if (data.phone) this.phone.set(data.phone);
    if (data.address) this.address.set(data.address);
    if (data.date) this.date.set(data.date);
    if (data.duration) this.duration.set(data.duration);
    if (data.notes) this.notes.set(data.notes);
  }

  isValid(): boolean {
    return !!(this.fullName() && this.email() && this.phone() && this.address() && this.date() && this.duration());
  }

  submit() {
    if (!this.isValid()) return;
    this.detailsSubmitted.emit({
      fullName: this.fullName(),
      email: this.email(),
      phone: this.phone(),
      address: this.address(),
      date: this.date(),
      duration: this.duration(),
      notes: this.notes()
    });
  }

  back() {
    this.goBack.emit();
  }
}

