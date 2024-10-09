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
import { FunctionListComponent } from './components/function-list/function-list.component';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ProductDropdownComponent } from './components/product-dropdown/product-dropdown.component';
import { ProductModeModule } from './product-mode/product-mode.module';
import { StepperComponent } from './design-mode/stepper/stepper.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient } from '@angular/common/http';
import { SummaryComponent } from './design-mode/summary/summary.component';
import { TestingComponent } from './testing/testing.component';
import { ContactPageComponent } from './contact-page/contact-page.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';

@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    NavbarComponent,
    CarouselComponent,
    CardComponent,
    ProductListComponent,
    FooterComponent,
    FunctionListComponent,
    ProductDropdownComponent,
    TestingComponent,
    ContactPageComponent,
  ],
  imports: [
    LoginComponent,
    SignupComponent,
    ProductModeModule,
    StepperComponent,
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive
    ],
  providers: [
    provideClientHydration(),
    provideAnimationsAsync(),
    provideHttpClient(),
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
