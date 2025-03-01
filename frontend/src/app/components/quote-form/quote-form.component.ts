import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';

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
  errorMsg: string = ''

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private userService: UserService) { }

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
      virusType: [''],
      mammalianCells: [''],
      plasmidAmount: [''],
      virusAmount: [''],
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
    this.quoteForm.controls['productType'].updateValueAndValidity();
    this.quoteForm.controls['serviceType'].updateValueAndValidity();
  }

  onSubmit() {
    if (this.quoteForm.valid) {
      this.userService.submitQuoteForm(this.quoteForm.value).subscribe(
        (res) => {
          this.submitted = true;
          this.errorMsg = ''
        },
        (err) => {
          this.errorMsg = 'An error has occurred. Please try again.'
        }
      )
    } else if (this.quoteForm.controls['email'].hasError('email')) {
      this.errorMsg = 'Invalid email address.'
    } else {
      this.errorMsg = 'Please complete all required fields.'
    }
  }

}
