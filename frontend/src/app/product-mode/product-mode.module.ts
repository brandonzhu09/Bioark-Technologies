import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductPageComponent } from './product-page/product-page.component';
import { ProductHomeComponent } from './product-home/product-home.component';



@NgModule({
  declarations: [
    ProductPageComponent,
    ProductHomeComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ProductPageComponent
  ]
})
export class ProductModeModule { }
