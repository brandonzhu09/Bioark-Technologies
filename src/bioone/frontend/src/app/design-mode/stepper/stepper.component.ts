import { Component, Input } from '@angular/core';
import {FormBuilder, Validators, FormsModule, ReactiveFormsModule, FormControl, FormGroup} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatStepperModule} from '@angular/material/stepper';
import { DesignFormService } from '../design-form.service';
import { CommonModule } from '@angular/common';
import {MatTabsModule} from '@angular/material/tabs';


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
    promoterId: new FormControl('', [
      Validators.required,
      Validators.minLength(3)
    ])
  })

  // Forms
  handleProductCategoryClick = (card: any) => { this.firstFormGroup.controls.productCategoryId.setValue(card.category_id);}
  handleFunctionTypeClick = (card: any) => {this.secondFormGroup.controls.functionTypeId.setValue(card.function_type_id);}
  handleDeliveryTypeClick = (card: any) => {this.thirdFormGroup.controls.deliveryTypeSymbol.setValue(card.delivery_type_symbol);}

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
    let delivery_type_symbol = this.thirdFormGroup.value.deliveryTypeSymbol;
    console.log([this.secondFormGroup.value])
  }

  onSubmit() {
    console.log([this.firstFormGroup.value, this.secondFormGroup.value]); 
  }

  ngOnInit() {
    this.designFormService.getProductCategories().subscribe(
      (response) => {this.productCategoryCards = response;}
    )
  }

  
}
