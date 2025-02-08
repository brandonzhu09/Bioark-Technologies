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
import { ProductSummaryComponent } from './components/product-summary/product-summary.component';
import { CustomCloningPageComponent } from './service-mode/custom-cloning-page/custom-cloning-page.component';
import { LentivirusPackagePageComponent } from './service-mode/lentivirus-package-page/lentivirus-package-page.component';
import { StableCellPageComponent } from './service-mode/stable-cell-page/stable-cell-page.component';
import { EmailVerificationComponent } from './components/email-verification/email-verification.component';
import { ResendVerificationComponent } from './components/resend-verification/resend-verification.component';
import { MessagePageComponent } from './user-mode/message-page/message-page.component';
import { PopupComponent } from './components/popup/popup.component';
import { OrderConfirmationComponent } from './components/order-confirmation/order-confirmation.component';
import { BlogPostComponent } from './components/blog-post/blog-post.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'profile', component: UserPageComponent },
  { path: 'profile/orders', component: OrderPageComponent },
  { path: 'profile/settings', component: UserSettingsComponent },
  { path: 'profile/services/:service', component: ServiceFormComponent },
  { path: 'profile/messages', component: MessagePageComponent },
  { path: 'summary-temp', component: SummaryComponent },
  { path: 'design', component: StepperComponent },
  { path: 'product', component: ProductPageComponent },
  { path: 'cart', component: CartComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'testing', component: TestingComponent },
  { path: 'products/overexpression', component: OverexpressionPageComponent },
  { path: 'products/gene-knock-in', component: GeneKnockInPageComponent },
  { path: 'products/gene-knock-out', component: GeneKnockOutPageComponent },
  { path: 'products/gene-deletion', component: GeneDeletionPageComponent },
  { path: 'products/rna-knock-down', component: RnaKnockDownPageComponent },
  { path: 'products/:product-sku', component: ProductSummaryComponent },
  { path: 'services/custom-cloning', component: CustomCloningPageComponent },
  { path: 'services/lentivirus-package', component: LentivirusPackagePageComponent },
  { path: 'services/stable-cell-line', component: StableCellPageComponent },
  { path: 'contact', component: ContactPageComponent },
  { path: 'quote', component: QuoteFormComponent },
  { path: 'quote/:serviceType', component: QuoteFormComponent },
  { path: 'verify-email/:token', component: EmailVerificationComponent },
  { path: 'resend-verification', component: ResendVerificationComponent },
  { path: 'test', component: PopupComponent },
  { path: 'order-confirmation', component: OrderConfirmationComponent },
  { path: 'blog/:id', component: BlogPostComponent },
  { path: '', component: LandingComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
