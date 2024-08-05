import { Component, Input } from '@angular/core';
import {FormBuilder, Validators, FormsModule, ReactiveFormsModule, FormControl, FormGroup} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatStepperModule} from '@angular/material/stepper';
import { DesignFormService } from '../design-form.service';


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
  ]
})
export class StepperComponent {

  constructor(private designFormService: DesignFormService) { }

  isLinear = true;

  selectedFirstFormId: number | null = null;
  selectedSecondFormId: number | null = null;

  productCategoryCards: any;
  functionTypeCards: any;
  
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
    deliveryTypeId: new FormControl('', [
      Validators.required,
      Validators.minLength(3)
    ])
  })

  // User Interaction
  isSelected(index: number, cardId: number): boolean {
    if (index == 1) {
      return cardId == this.selectedFirstFormId;
    }
    else if (index == 2) {
      return cardId == this.selectedSecondFormId;
    }
    return cardId === this.selectedFirstFormId;
  }

  // Forms
  handleProductCategoryClick(card: any) {
    this.firstFormGroup.controls['productCategoryId'].setValue(card.category_id);
    this.selectedFirstFormId = card.category_id;
    // console.log('Card clicked:', card.text);
  }

  submitProductCategory() {
    let category_id = this.firstFormGroup.value['productCategoryId'];
    if (category_id != '' && category_id != null) {
      this.designFormService.getFunctionTypesByCategory(category_id).subscribe(
        (response) => {this.functionTypeCards = response; console.log(response)}
      )
    }
    console.log(this.firstFormGroup.value);
  }

  handleFunctionTypeClick(card: any) {
    this.secondFormGroup.controls['functionTypeId'].setValue(card.function_type_id);
    this.selectedSecondFormId = card.function_type_id;
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
