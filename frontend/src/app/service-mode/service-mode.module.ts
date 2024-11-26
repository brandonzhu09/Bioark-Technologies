import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceHomeComponent } from './service-home/service-home.component';
import { CustomCloningPageComponent } from './custom-cloning-page/custom-cloning-page.component';
import { LentivirusPackagePageComponent } from './lentivirus-package-page/lentivirus-package-page.component';
import { StableCellPageComponent } from './stable-cell-page/stable-cell-page.component';



@NgModule({
  declarations: [
    ServiceHomeComponent,
    CustomCloningPageComponent,
    LentivirusPackagePageComponent,
    StableCellPageComponent
  ],
  imports: [
    CommonModule
  ]
})
export class ServiceModeModule { }
