import { Injectable, signal, computed } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import { OrderRequest, Lead, AdminToken, Service } from '../models/service.model';

export type SubmissionState = 'idle' | 'submitting' | 'success' | 'error';

@Injectable({ providedIn: 'root' })
export class SupabaseService {
  private supabase: SupabaseClient;

  /** Accès public au client pour auth et queries admin */
  get client(): SupabaseClient {
    return this.supabase;
  }

  /** État de la soumission */
  readonly submissionState = signal<SubmissionState>('idle');

  /** Message d'erreur éventuel */
  readonly errorMessage = signal<string | null>(null);

  /** Services chargés depuis Supabase */
  readonly services = signal<Service[]>([]);

  /** Signaux dérivés pour le template */
  readonly isSubmitting = computed(() => this.submissionState() === 'submitting');
  readonly isSuccess = computed(() => this.submissionState() === 'success');
  readonly isError = computed(() => this.submissionState() === 'error');

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseAnonKey
    );
  }

  /**
   * Charge les services actifs depuis Supabase (table `services`).
   */
  async loadServices(): Promise<Service[]> {
    const { data, error } = await this.supabase
      .from('services')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (!error && data) {
      this.services.set(data as Service[]);
      return data as Service[];
    }
    return [];
  }

  /**
   * Résout le label d'un service à partir de son slug.
   */
  getServiceLabel(slug: string): string {
    const svc = this.services().find(s => s.slug === slug);
    return svc ? `${svc.icon} ${svc.title}` : slug;
  }

  /**
   * Insère un nouveau lead dans la table `leads`.
   */
  async insertLead(order: OrderRequest): Promise<Lead | null> {
    this.submissionState.set('submitting');
    this.errorMessage.set(null);

    // Payload en snake_case pour correspondre exactement aux colonnes Supabase
    const lead = {
      service_id:   order.service_id || null,
      service_slug: order.service_slug,
      client_type:  order.client_type,
      full_name:    order.fullName,
      company:      order.company,
      email:        order.email,
      phone:        order.phone,
      address:      order.address,
      date:         order.date,
      duration:     order.duration,
      notes:        order.notes,
      status:       'new',
    };

    const { data, error } = await this.supabase
      .from('leads')
      .insert(lead)
      .select()
      .single();

    if (error) {
      this.errorMessage.set(error.message);
      this.submissionState.set('error');
      return null;
    }

    this.submissionState.set('success');
    return data as Lead;
  }

  /**
   * Enregistre un token FCM d'administrateur dans `admin_tokens`.
   */
  async saveAdminToken(token: string): Promise<void> {
    const { data: existing } = await this.supabase
      .from('admin_tokens')
      .select('id')
      .eq('token', token)
      .maybeSingle();

    if (existing) return;

    const { error } = await this.supabase
      .from('admin_tokens')
      .insert({ token } as AdminToken);

    if (error) {
      console.error('[SupabaseService] Erreur sauvegarde token:', error.message);
    }
  }

  /** Réinitialise l'état de soumission */
  resetState(): void {
    this.submissionState.set('idle');
    this.errorMessage.set(null);
  }
}
