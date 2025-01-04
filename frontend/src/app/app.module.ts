import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LandingComponent } from './components/landing/landing.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { CarouselComponent } from './components/carousel/carousel.component';
import { CardComponent } from './components/card/card.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { FooterComponent } from './components/footer/footer.component';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ProductDropdownComponent } from './components/product-dropdown/product-dropdown.component';
import { ProductModeModule } from './product-mode/product-mode.module';
import { StepperComponent } from './design-mode/stepper/stepper.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HTTP_INTERCEPTORS, provideHttpClient } from '@angular/common/http';
import { SummaryComponent } from './design-mode/summary/summary.component';
import { TestingComponent } from './testing/testing.component';
import { ContactPageComponent } from './contact-page/contact-page.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { AuthInterceptor } from './services/auth.interceptor';
import { AuthService } from './services/auth.service';
import { ServiceListComponent } from './components/service-list/service-list.component';
import { QuoteFormComponent } from './components/quote-form/quote-form.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ReactiveFormsModule } from '@angular/forms';
import { ResearchBlogComponent } from './components/research-blog/research-blog.component';
import { BlogPostComponent } from './components/blog-post/blog-post.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { UserPageComponent } from './user-mode/user-page/user-page.component';
import { OrderPageComponent } from './user-mode/order-page/order-page.component';
import { UserSettingsComponent } from './user-mode/user-settings/user-settings.component';
import { ServiceFormComponent } from './user-mode/service-form/service-form.component';
import { ProductSummaryComponent } from './components/product-summary/product-summary.component';
import { ServiceDropdownComponent } from './components/service-dropdown/service-dropdown.component';
import { EmailVerificationComponent } from './components/email-verification/email-verification.component';
import { SetPasswordComponent } from './components/set-password/set-password.component';
import { CartComponent } from './orders/cart/cart.component';

@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    NavbarComponent,
    CarouselComponent,
    CardComponent,
    ProductListComponent,
    FooterComponent,
    ProductDropdownComponent,
    TestingComponent,
    ContactPageComponent,
    ServiceListComponent,
    QuoteFormComponent,
    ResearchBlogComponent,
    BlogPostComponent,
    UserPageComponent,
    OrderPageComponent,
    UserSettingsComponent,
    ServiceFormComponent,
    ProductSummaryComponent,
    ServiceDropdownComponent,
    EmailVerificationComponent,
    SetPasswordComponent,
  ],
  imports: [
    LoginComponent,
    SignupComponent,
    CartComponent,
    ProductModeModule,
    StepperComponent,
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatRadioModule,
    MatTabsModule,
    MatIconModule,
    MatPaginator,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    ReactiveFormsModule,
    GoogleMapsModule
  ],
  providers: [
    provideClientHydration(),
    provideAnimationsAsync(),
    provideHttpClient(),
    AuthService,
    {
      provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
