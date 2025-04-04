import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CarouselComponent } from './components/carousel/carousel.component';
import { LandingComponent } from './components/landing/landing.component';
import { ProductPageComponent } from './product-mode/product-page/product-page.component';
import { StepperComponent } from './design-mode/stepper/stepper.component';
import { SummaryComponent } from './design-mode/summary/summary.component';
import { CartComponent } from './orders/cart/cart.component';
import { TestingComponent } from './testing/testing.component';
import { ServiceHomeComponent } from './service-mode/service-home/service-home.component';
import { ContactPageComponent } from './contact-page/contact-page.component';
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
import { ProductSidebarComponent } from './components/product-sidebar/product-sidebar.component';
import { PromotionSectionComponent } from './components/promotion-section/promotion-section.component';
import { ProductModePageComponent } from './product-mode/product-mode-page/product-mode-page.component';
import { ServiceModePageComponent } from './service-mode/service-mode-page/service-mode-page.component';
import { FeaturedProductPageComponent } from './product-mode/featured-product-page/featured-product-page.component';
import { authGuard } from './guards/auth.guard';
import { checkoutGuard } from './guards/checkout.guard';
import { DesignDiagramComponent } from './design-mode/design-diagram/design-diagram.component';
import { SearchPageComponent } from './components/search-page/search-page.component';
import { InvoiceCheckoutComponent } from './orders/invoice-checkout/invoice-checkout.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'search', component: SearchPageComponent },
  { path: 'profile', component: UserPageComponent, canActivate: [authGuard] },
  { path: 'profile/orders', component: OrderPageComponent, canActivate: [authGuard] },
  { path: 'profile/settings', component: UserSettingsComponent, canActivate: [authGuard] },
  { path: 'profile/services/:service', component: ServiceFormComponent, canActivate: [authGuard] },
  { path: 'profile/messages', component: MessagePageComponent, canActivate: [authGuard] },
  { path: 'summary-temp', component: SummaryComponent },
  { path: 'design', component: StepperComponent },
  { path: 'product', component: ProductPageComponent },
  { path: 'product/featured/:catalog-number', component: FeaturedProductPageComponent },
  { path: 'cart', component: CartComponent },
  { path: 'checkout', component: CheckoutComponent, canActivate: [checkoutGuard] },
  { path: 'checkout/:order-number', component: InvoiceCheckoutComponent },
  { path: 'testing', component: TestingComponent },
  { path: 'products/item/:product-sku', component: ProductSummaryComponent },
  { path: 'products/:url', component: ProductModePageComponent },
  { path: 'services/:url', component: ServiceModePageComponent },
  { path: 'contact', component: ContactPageComponent },
  { path: 'quote', component: QuoteFormComponent },
  { path: 'quote/:serviceType', component: QuoteFormComponent },
  { path: 'verify-email/:token', component: EmailVerificationComponent },
  { path: 'resend-verification', component: ResendVerificationComponent },
  { path: 'order-confirmation/:token', component: OrderConfirmationComponent, canActivate: [authGuard] },
  { path: 'blog/:id', component: BlogPostComponent },
  { path: '', component: LandingComponent, pathMatch: 'full' },
  { path: 'test', component: SearchPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
