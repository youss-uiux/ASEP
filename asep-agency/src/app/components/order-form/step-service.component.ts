import { Component, input, output, signal, inject, OnInit } from '@angular/core';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-step-service',
  standalone: true,
  templateUrl: './step-service.component.html',
  styleUrl: './step-service.component.css'
})
export class StepServiceComponent implements OnInit {
  selectedService = input('');
  serviceChosen = output<{ slug: string; id: string }>();

  private supabaseService = inject(SupabaseService);
  services = this.supabaseService.services;
  hoveredCard = signal<string | null>(null);

  async ngOnInit() {
    if (this.services().length === 0) {
      await this.supabaseService.loadServices();
    }
  }

  selectService(slug: string, id: string) {
    this.serviceChosen.emit({ slug, id });
  }
}
