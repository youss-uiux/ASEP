import { Component, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './admin-login.component.html',
  styleUrl: './admin-login.component.css',
})
export class AdminLoginComponent {
  email = '';
  password = '';
  loading = signal(false);
  error = signal('');
  showPassword = signal(false);

  private supabase = inject(SupabaseService);
  private router = inject(Router);

  async login() {
    if (!this.email || !this.password) {
      this.error.set('Veuillez remplir tous les champs.');
      return;
    }

    this.loading.set(true);
    this.error.set('');

    const { error } = await this.supabase.client.auth.signInWithPassword({
      email: this.email,
      password: this.password,
    });

    if (error) {
      this.error.set('Identifiants incorrects. Veuillez réessayer.');
    } else {
      this.router.navigate(['/admin/dashboard']);
    }

    this.loading.set(false);
  }

  togglePassword() {
    this.showPassword.update(v => !v);
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') this.login();
  }
}

