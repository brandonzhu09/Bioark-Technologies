import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StepperComponent } from './stepper/stepper.component';
import { SummaryComponent } from './summary/summary.component';


@NgModule({
  declarations: [
    StepperComponent,
    SummaryComponent
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    StepperComponent,
    SummaryComponent,
  ]
})
export class DesignModeModule { }
