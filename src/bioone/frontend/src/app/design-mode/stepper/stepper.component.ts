import { Component, Input } from '@angular/core';
import {FormBuilder, Validators, FormsModule, ReactiveFormsModule, FormControl, FormGroup} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatStepperModule} from '@angular/material/stepper';
import { DesignFormService } from '../design-form.service';
import { CommonModule } from '@angular/common';
import {MatTabsModule} from '@angular/material/tabs';
import { HttpResponse } from '@angular/common/http';


@Component({
  selector: 'stepper',
  templateUrl: './stepper.component.html',
  styleUrl: './stepper.component.css',
  standalone: true,
  imports: [
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    CommonModule,
    MatTabsModule,
  ]
})
export class StepperComponent {

  constructor(private designFormService: DesignFormService) { }

  isLinear = true;

  productCategoryCards: any;
  functionTypeCards: any;
  deliveryTypeCards: any;
  promoterCards: any;
  proteinTagCards: any;
  fluoresceneMarkerCards: any;
  selectionMarkerCards: any;
  bacterialMarkerCards: any;
  
  firstFormGroup = new FormGroup({
    productCategoryId: new FormControl('', [
      Validators.required,
      Validators.minLength(3)
    ])
  })
  secondFormGroup = new FormGroup({
    functionTypeId: new FormControl('', [
      Validators.required,
      Validators.minLength(3)
    ])
  })
  thirdFormGroup = new FormGroup({
    deliveryTypeSymbol: new FormControl('', [
      Validators.required,
      Validators.minLength(1)
    ])
  })
  fourthFormGroup = new FormGroup({
    promoterCode: new FormControl('', [
      Validators.required,
      Validators.minLength(1)
    ]),
    proteinTagCode: new FormControl('', [
      Validators.required,
      Validators.minLength(1)
    ]),
    fluoresceneMarkerCode: new FormControl('', [
      Validators.required,
      Validators.minLength(1)
    ]),
    selectionMarkerCode: new FormControl('', [
      Validators.required,
      Validators.minLength(1)
    ]),
    bacterialMarkerCode: new FormControl('', [
      Validators.required,
      Validators.minLength(1)
    ]),
  })

  // Forms
  handleProductCategoryClick = (card: any) => { this.firstFormGroup.controls.productCategoryId.setValue(card.category_id);}
  handleFunctionTypeClick = (card: any) => {this.secondFormGroup.controls.functionTypeId.setValue(card.function_type_id);}
  handleDeliveryTypeClick = (card: any) => {this.thirdFormGroup.controls.deliveryTypeSymbol.setValue(card.delivery_type_symbol);}
  handlePromoterClick = (card: any) => {this.fourthFormGroup.controls.promoterCode.setValue(card.promoter_code);}
  handleProteinTagClick = (card: any) => {this.fourthFormGroup.controls.proteinTagCode.setValue(card.protein_tag_code);}
  handleFluoresceneMarkerClick = (card: any) => {this.fourthFormGroup.controls.fluoresceneMarkerCode.setValue(card.fluorescene_marker_code);}
  handleSelectionMarkerClick = (card: any) => {this.fourthFormGroup.controls.selectionMarkerCode.setValue(card.selection_marker_code);}
  handleBacterialMarkerClick = (card: any) => {this.fourthFormGroup.controls.bacterialMarkerCode.setValue(card.bacterial_marker_code);}

  submitFirstForm() {
    let category_id = this.firstFormGroup.value.productCategoryId;
    if (category_id != '' && category_id != null) {
      this.designFormService.getFunctionTypesByCategory(category_id).subscribe(
        (response) => {this.functionTypeCards = response; console.log(response)}
      )
    }
  }

  submitSecondForm() {
    let function_type_id = this.secondFormGroup.value.functionTypeId;
    if (function_type_id != '' && function_type_id != null) {
      this.designFormService.getDeliveryTypesByFunctionType(function_type_id).subscribe(
        (response) => {this.deliveryTypeCards = response; console.log(response)}
      )
    }
  }

  submitThirdForm() {
    let function_type_id = this.secondFormGroup.value.functionTypeId;
    let delivery_type_symbol = this.thirdFormGroup.value.deliveryTypeSymbol;
    if (function_type_id != null && delivery_type_symbol != null) {
      this.designFormService.getCodeP(function_type_id, delivery_type_symbol).subscribe(
        (response) => {
          this.promoterCards = response.promoters;
          this.proteinTagCards = response.protein_tags;
          this.fluoresceneMarkerCards = response.fluorescene_markers;
          this.selectionMarkerCards = response.selection_markers;
          this.bacterialMarkerCards = response.bacterial_markers;
        }
      )
    }
  }

  isEmpty(str: string | null | undefined) {
    return str == '' || str == null;
  }

  onSubmit() {
    console.log([this.firstFormGroup.value, this.secondFormGroup.value, this.fourthFormGroup.value]); 
  }

  ngOnInit() {
    this.designFormService.getProductCategories().subscribe(
      (response) => {this.productCategoryCards = response;}
    )
  }

  
}
