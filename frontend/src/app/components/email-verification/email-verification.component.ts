import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-email-verification',
  templateUrl: './email-verification.component.html',
  styleUrl: './email-verification.component.css'
})
export class EmailVerificationComponent {
  token: string = '';
  email: string = '';
  setPassword: boolean = false;
  isVerified: boolean = false;
  StrongPasswordRegx: RegExp = /^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d).{8,}$/;
  errorMsg: string = '';

  passwordForm = new FormGroup({
    password: new FormControl('', [Validators.required, Validators.pattern(this.StrongPasswordRegx)]),
    confirmPassword: new FormControl('', Validators.required)
  })

  constructor(private route: ActivatedRoute, private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.token = params.get('token')!;
    });

    // check if the account that the token verifies has a password
    this.authService.verifyEmail(this.token).subscribe(res => {
      // if password need to be set, display password reset form
      if (res.status == "not_activated") {
        this.setPassword = true;
        this.email = res.email;
      }
      // if account cant be verified, display error page
      else if (res.status == "not_verified") {
        this.isVerified = false;
      }
      else if (res.status == "activated") {
        this.isVerified = true;
      }
    })
  }

  submitPassword() {
    if (this.passwordForm.controls.password.hasError('pattern')) {
      this.errorMsg = 'Your password must be at least 8 characters long, one number, and have uppercase and lowercase letters.'
    }
    else if (this.passwordForm.value.password !== this.passwordForm.value.confirmPassword) {
      this.errorMsg = 'Passwords do not match. Try again.'
    }
    else if (this.passwordForm.controls.password.hasError('required') || this.passwordForm.controls.confirmPassword.hasError('required')) {
      this.errorMsg = 'All fields are required.'
    }
    else if (this.passwordForm.valid && this.passwordForm.value.password === this.passwordForm.value.confirmPassword && this.email !== '') {
      this.authService.signup({ 'email': this.email, 'password': this.passwordForm.value.password }).subscribe(
        (res) => {
          this.router.navigate(['/login'], { queryParams: { redirectUrl: 'checkout' } }).then(() => {
            window.location.reload();
            alert('Your account has been successfully activated.')
          })
        },
        (err) => {
          this.errorMsg = 'An error has occurred. Please contact us so we can help resolve the issue.'
        }
      );
    }
    else {
      this.errorMsg = 'An error has occurred. Please contact us so we can help resolve the issue.'
    }
  }

}
