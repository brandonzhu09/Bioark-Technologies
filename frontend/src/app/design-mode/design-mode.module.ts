import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StepperComponent } from './stepper/stepper.component';
import { SummaryComponent } from './summary/summary.component';
import { DesignDiagramComponent } from './design-diagram/design-diagram.component';


@NgModule({
  declarations: [
    DesignDiagramComponent
  ],
  imports: [
    CommonModule,
    // DesignDiagramComponent
  ],
  exports: [
  ]
})
export class DesignModeModule { }
