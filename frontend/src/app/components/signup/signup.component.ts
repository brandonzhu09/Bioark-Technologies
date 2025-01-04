import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormControl, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  StrongPasswordRegx: RegExp = /^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d).{8,}$/;
  emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  passwordFormControl = new FormControl('', [Validators.required, Validators.pattern(this.StrongPasswordRegx)]);

  signupForm = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.pattern(this.StrongPasswordRegx)])
  });

  errorMsg: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  onSubmit(credentials: any) {
    if (this.signupForm.valid) {
      console.log(credentials)
      this.authService.signup(credentials).subscribe(
        (response) => {
          if (response.success == true) {
            this.router.navigate(['/']).then(() => {
              window.location.reload();
            });
            this.authService.isAuthenticated = true;
          } else {
            this.authService.isAuthenticated = false;
          }
        },
        (err) => {
          console.log(err)
          this.errorMsg = err.error.detail;
          console.log(this.errorMsg)
        }
      );
    }
  }
}
