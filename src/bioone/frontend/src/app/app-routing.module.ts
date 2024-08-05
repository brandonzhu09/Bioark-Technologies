import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CarouselComponent } from './components/carousel/carousel.component';
import { LandingComponent } from './components/landing/landing.component';
import { ProductPageComponent } from './product-mode/product-page/product-page.component';
import { StepperComponent } from './design-mode/stepper/stepper.component';

const routes: Routes = [
  {path: 'design', component: StepperComponent},
  {path: 'product', component: ProductPageComponent},
  {path: '', component: LandingComponent, pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
