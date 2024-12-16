import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'quote-form',
  templateUrl: './quote-form.component.html',
  styleUrl: './quote-form.component.css'
})
export class QuoteFormComponent {
  @Input() type: string = '';
  @Input() currentType: string = '';
  serviceType: string = '';
  quoteForm!: FormGroup;
  submitted: boolean = false;

  constructor(private fb: FormBuilder, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.serviceType = params.get('serviceType')!;
    });

    if (this.serviceType != '' && this.serviceType != null) {
      this.type = 'serviceType';
      this.currentType = this.serviceType;
    }

    this.quoteForm = this.fb.group({
      type: [this.type, Validators.required],
      productType: [this.currentType],
      serviceType: [this.currentType],
      geneSequence: [''],
      geneSpecies: [''],
      mammalianCells: [''],
      plasmidAmount: [''],
      cellLineAmount: [''],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      institution: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      message: ['', Validators.required]
    });

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
