import { Component } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { HeroComponent } from '../../components/hero/hero.component';
import { ServicesGridComponent } from '../../components/services-grid/services-grid.component';
import { AboutComponent } from '../../components/about/about.component';
import { TestimonialsComponent } from '../../components/testimonials/testimonials.component';
import { OrderFormComponent } from '../../components/order-form/order-form.component';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    NavbarComponent,
    HeroComponent,
    ServicesGridComponent,
    AboutComponent,
    TestimonialsComponent,
    OrderFormComponent,
    FooterComponent,
  ],
  template: `
    <app-navbar />
    <main>
      <app-hero />
      @defer (on viewport) {
        <app-services-grid />
      } @placeholder { <div style="min-height:400px"></div> }

      @defer (on viewport) {
        <app-about />
      } @placeholder { <div style="min-height:400px"></div> }

      @defer (on viewport) {
        <app-testimonials />
      } @placeholder { <div style="min-height:300px"></div> }

      @defer (on viewport) {
        <app-order-form />
      } @placeholder { <div style="min-height:400px"></div> }
    </main>
    <app-footer />
  `,
})
export class HomeComponent {}

