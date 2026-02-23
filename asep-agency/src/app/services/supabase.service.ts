import { Injectable, signal, computed } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import { OrderRequest, Lead, AdminToken } from '../models/service.model';

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

  /** Signaux dérivés pour le template */
  readonly isSubmitting = computed(() => this.submissionState() === 'submitting');
  readonly isSuccess = computed(() => this.submissionState() === 'success');
  readonly isError = computed(() => this.submissionState() === 'error');

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseAnonKey
    );
    // 🔍 DIAGNOSTIC — à supprimer après confirmation
    const key = environment.supabaseAnonKey;
    console.log('[Supabase] URL:', environment.supabaseUrl);
    console.log('[Supabase] Clé (début):', key.substring(0, 20));
    console.log('[Supabase] Clé est un JWT ?', key.startsWith('eyJ'));
  }

  /**
   * Insère un nouveau lead dans la table `leads`.
   */
  async insertLead(order: OrderRequest): Promise<Lead | null> {
    this.submissionState.set('submitting');
    this.errorMessage.set(null);

    // Payload en snake_case pour correspondre exactement aux colonnes Supabase
    const lead = {
      service:   order.service,
      full_name: order.fullName,
      email:     order.email,
      phone:     order.phone,
      address:   order.address,
      date:      order.date,
      duration:  order.duration,
      notes:     order.notes,
      status:    'new',
    };

    console.log('[Supabase] Payload INSERT:', lead);

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
    // Vérifie si le token existe déjà
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

