import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductPageComponent } from './product-page/product-page.component';
import { ProductHomeComponent } from './product-home/product-home.component';
import { OverexpressionPageComponent } from './overexpression-page/overexpression-page.component';
import { GeneKnockInPageComponent } from './gene-knock-in-page/gene-knock-in-page.component';
import { GeneKnockOutPageComponent } from './gene-knock-out-page/gene-knock-out-page.component';
import { GeneDeletionPageComponent } from './gene-deletion-page/gene-deletion-page.component';
import { RnaKnockDownPageComponent } from './rna-knock-down-page/rna-knock-down-page.component';


@NgModule({
  declarations: [
    ProductPageComponent,
    ProductHomeComponent,
    OverexpressionPageComponent,
    GeneKnockInPageComponent,
    GeneKnockOutPageComponent,
    GeneDeletionPageComponent,
    RnaKnockDownPageComponent,
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ProductPageComponent
  ]
})
export class ProductModeModule { }
