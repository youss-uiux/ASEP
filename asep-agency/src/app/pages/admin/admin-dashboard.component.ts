import { Component, signal, inject, OnInit, computed } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { SupabaseService } from '../../services/supabase.service';
import { LeadStatus } from '../../models/service.model';

interface LeadRow {
  id: string;
  service: string;
  service_slug: string;
  service_id: string;
  client_type: string;
  company: string;
  full_name: string;
  email: string;
  phone: string;
  address: string;
  date: string;
  duration: string;
  notes: string;
  status: LeadStatus;
  created_at: string;
}

const STATUS_LABELS: Record<string, string> = {
  new:         'Nouveau',
  contacted:   'Contacté',
  in_progress: 'En cours',
  closed:      'Clôturé',
};

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css',
})
export class AdminDashboardComponent implements OnInit {
  leads        = signal<LeadRow[]>([]);
  loading      = signal(true);
  filterStatus = signal<LeadStatus | 'all'>('all');
  searchQuery  = signal('');
  selectedLead = signal<LeadRow | null>(null);
  updatingId   = signal<string | null>(null);

  statusLabels  = STATUS_LABELS;
  statusKeys    = ['all', 'new', 'contacted', 'in_progress', 'closed'] as const;

  filteredLeads = computed(() => {
    let list = this.leads();
    if (this.filterStatus() !== 'all') {
      list = list.filter(l => l.status === this.filterStatus());
    }
    const q = this.searchQuery().toLowerCase();
    if (q) {
      list = list.filter(l =>
        l.full_name.toLowerCase().includes(q) ||
        l.email.toLowerCase().includes(q) ||
        l.phone.includes(q)
      );
    }
    return list;
  });

  stats = computed(() => ({
    total:       this.leads().length,
    new:         this.leads().filter(l => l.status === 'new').length,
    contacted:   this.leads().filter(l => l.status === 'contacted').length,
    in_progress: this.leads().filter(l => l.status === 'in_progress').length,
    closed:      this.leads().filter(l => l.status === 'closed').length,
  }));

  private supabase = inject(SupabaseService);
  private router   = inject(Router);

  async ngOnInit() {
    const { data: { session } } = await this.supabase.client.auth.getSession();
    if (!session) {
      this.router.navigate(['/admin']);
      return;
    }
    await this.supabase.loadServices();
    await this.loadLeads();
  }

  async loadLeads() {
    this.loading.set(true);
    const { data, error } = await this.supabase.client
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) this.leads.set(data as LeadRow[]);
    this.loading.set(false);
  }

  async updateStatus(lead: LeadRow, status: LeadStatus) {
    this.updatingId.set(lead.id);
    const { error } = await this.supabase.client
      .from('leads')
      .update({ status })
      .eq('id', lead.id);

    if (!error) {
      this.leads.update(list =>
        list.map(l => l.id === lead.id ? { ...l, status } : l)
      );
      if (this.selectedLead()?.id === lead.id) {
        this.selectedLead.update(l => l ? { ...l, status } : l);
      }
    }
    this.updatingId.set(null);
  }

  openDetail(lead: LeadRow) {
    this.selectedLead.set(lead);
  }

  closeDetail() {
    this.selectedLead.set(null);
  }

  onSearch(event: Event) {
    this.searchQuery.set((event.target as HTMLInputElement).value);
  }

  setFilter(status: LeadStatus | 'all') {
    this.filterStatus.set(status);
  }

  async logout() {
    await this.supabase.client.auth.signOut();
    this.router.navigate(['/admin']);
  }

  getServiceLabel(slug: string): string {
    return this.supabase.getServiceLabel(slug);
  }

  getStatusLabel(s: string): string {
    return STATUS_LABELS[s] || s;
  }
}
