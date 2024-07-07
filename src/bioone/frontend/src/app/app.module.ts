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
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive
    ],
  providers: [
    provideClientHydration()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
