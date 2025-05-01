import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-message-form',
  templateUrl: './message-form.component.html',
  styleUrl: './message-form.component.css'
})
export class MessageFormComponent {
  successMessage: string = '';
  errorMessage: string = '';
  product: string = 'N/A';

  contactForm = new FormGroup({
    firstName: new FormControl('', [
      Validators.minLength(1),
    ]),
    lastName: new FormControl('', [
      Validators.minLength(1),
    ]),
    email: new FormControl('', [
      Validators.required,
      Validators.email
    ]),
    phone: new FormControl(''),
    subject: new FormControl('', [
      Validators.required,
      Validators.minLength(1),
    ]),
    message: new FormControl('', [
      Validators.required,
      Validators.minLength(1),
    ]),
    product: new FormControl(this.product, [
      Validators.required,
    ]),
  });

  constructor(private userService: UserService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.product = params['product'] || 'N/A';
    });
  }

  onSubmit() {
    if (this.contactForm.valid) {
      this.userService.submitContactForm(this.contactForm.value).subscribe(
        (res) => {
          this.successMessage = 'Form submitted! We will get back to you as soon as possible!'
          this.errorMessage = ''
        },
        (err) => {
          this.successMessage = ''
          this.errorMessage = 'An error has occurred. Please try again.'
        }
      )
    } else if (this.contactForm.controls.email.hasError('email')) {
      this.successMessage = ''
      this.errorMessage = 'Invalid email address.'
    } else {
      this.successMessage = ''
      this.errorMessage = 'Please complete all required fields.'
    }
  }
}
