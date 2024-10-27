import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'quote-form',
  templateUrl: './quote-form.component.html',
  styleUrl: './quote-form.component.css'
})
export class QuoteFormComponent {
  quoteForm: FormGroup;
  submitted: boolean = false;

  constructor(private fb: FormBuilder) {
    this.quoteForm = this.fb.group({
      type: ['', Validators.required],
      productType: [''],
      serviceType: [''],
      geneSequence: [''],
      geneSpecies: [''],
      mammalianCells: [''],
      plasmidAmount: [''],
      cellLineAmount: [''],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.required, Validators.email],
      message: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.submitted = false;
  }

  handleTypes() {
    this.quoteForm.controls['productType'].clearValidators()
    this.quoteForm.controls['serviceType'].clearValidators()
    if (this.quoteForm.value.type == "productType") {
      this.quoteForm.controls['productType'].addValidators(Validators.required)
    }
    else if (this.quoteForm.value.type == "serviceType") {
      this.quoteForm.controls['serviceType'].addValidators(Validators.required)
    }
  }

  onSubmit() {
    this.submitted = true;
  }

}
