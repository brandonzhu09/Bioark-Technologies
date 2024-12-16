import { Component } from '@angular/core';
import { FormControl, Validators, FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule],
})
export class SignupComponent {
  StrongPasswordRegx: RegExp = /^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d).{8,}$/;
  emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  passwordFormControl = new FormControl('', [Validators.required, Validators.pattern(this.StrongPasswordRegx)]);

  signupForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.pattern(this.StrongPasswordRegx)])
  });

  constructor(private authService: AuthService, private router: Router) { }

  onSubmit(credentials: any) {
    if (this.signupForm.valid) {
      console.log(credentials)
      this.authService.signup(credentials).subscribe(
        (response) => {
          if (response.success) {
            this.router.navigate(['/']).then(() => {
              window.location.reload();
            });
            this.authService.isAuthenticated = true;
          } else {
            this.authService.isAuthenticated = false;
            console.log("Invalid credentials.")
          }
        }
      );
    }
  }
}
