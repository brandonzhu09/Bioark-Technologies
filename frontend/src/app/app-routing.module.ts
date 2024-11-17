import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CarouselComponent } from './components/carousel/carousel.component';
import { LandingComponent } from './components/landing/landing.component';
import { ProductPageComponent } from './product-mode/product-page/product-page.component';
import { StepperComponent } from './design-mode/stepper/stepper.component';
import { SummaryComponent } from './design-mode/summary/summary.component';
import { CartComponent } from './orders/cart/cart.component';
import { TestingComponent } from './testing/testing.component';
import { ProductHomeComponent } from './product-mode/product-home/product-home.component';
import { ServiceHomeComponent } from './service-mode/service-home/service-home.component';
import { ContactPageComponent } from './contact-page/contact-page.component';
import { OverexpressionPageComponent } from './product-mode/overexpression-page/overexpression-page.component';
import { GeneKnockInPageComponent } from './product-mode/gene-knock-in-page/gene-knock-in-page.component';
import { GeneKnockOutPageComponent } from './product-mode/gene-knock-out-page/gene-knock-out-page.component';
import { GeneDeletionPageComponent } from './product-mode/gene-deletion-page/gene-deletion-page.component';
import { RnaKnockDownPageComponent } from './product-mode/rna-knock-down-page/rna-knock-down-page.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { QuoteFormComponent } from './components/quote-form/quote-form.component';
import { CheckoutComponent } from './orders/checkout/checkout.component';
import { UserPageComponent } from './user-mode/user-page/user-page.component';
import { OrderPageComponent } from './user-mode/order-page/order-page.component';
import { UserSettingsComponent } from './user-mode/user-settings/user-settings.component';
import { ServiceFormComponent } from './user-mode/service-form/service-form.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'profile', component: UserPageComponent },
  { path: 'profile/orders', component: OrderPageComponent },
  { path: 'profile/settings', component: UserSettingsComponent },
  { path: 'profile/services/:service', component: ServiceFormComponent },
  { path: 'summary-temp', component: SummaryComponent },
  { path: 'design', component: StepperComponent },
  { path: 'product', component: ProductPageComponent },
  { path: 'cart', component: CartComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'testing', component: TestingComponent },
  { path: 'products', component: ProductHomeComponent },
  { path: 'products/overexpression', component: OverexpressionPageComponent },
  { path: 'products/gene-knock-in', component: GeneKnockInPageComponent },
  { path: 'products/gene-knock-out', component: GeneKnockOutPageComponent },
  { path: 'products/gene-deletion', component: GeneDeletionPageComponent },
  { path: 'products/rna-knock-down', component: RnaKnockDownPageComponent },
  { path: 'services', component: ServiceHomeComponent },
  { path: 'services/:serviceType', component: QuoteFormComponent },
  { path: 'contact', component: ContactPageComponent },
  { path: 'quote', component: QuoteFormComponent },
  { path: '', component: LandingComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
