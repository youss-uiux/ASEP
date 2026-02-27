import { Component, signal, inject, OnInit } from '@angular/core';
import { ServiceCardComponent } from './service-card.component';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-services-grid',
  standalone: true,
  imports: [ServiceCardComponent],
  templateUrl: './services-grid.component.html',
  styleUrl: './services-grid.component.css'
})
export class ServicesGridComponent implements OnInit {
  private supabaseService = inject(SupabaseService);
  hoveredService = signal<string | null>(null);
  services = this.supabaseService.services;

  async ngOnInit() {
    if (this.services().length === 0) {
      await this.supabaseService.loadServices();
    }
  }

  onServiceHover(serviceId: string | null) {
    this.hoveredService.set(serviceId);
  }
}
