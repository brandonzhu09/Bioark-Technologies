import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductPageComponent } from './product-page/product-page.component';



@NgModule({
  declarations: [
    ProductPageComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ProductPageComponent
  ]
})
export class ProductModeModule { }
