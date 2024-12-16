import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder, AbstractControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-set-password',
  templateUrl: './set-password.component.html',
  styleUrl: './set-password.component.css'
})
export class SetPasswordComponent {
  userId: string = '';
  successMessage: string = '';
  errorMessage: string = '';
  passwordForm: FormGroup;

  StrongPasswordRegx: RegExp = /^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d).{8,}$/;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private fb: FormBuilder
  ) {

    this.passwordForm = this.fb.group(
      {
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validator: this.passwordsMatchValidator } // Attach the custom validator to the FormGroup
    );
  }

  ngOnInit(): void {
    // Get userId from query parameters
    this.userId = this.route.snapshot.queryParamMap.get('userId') || '';
  }

  passwordsMatchValidator(group: AbstractControl): { [key: string]: any } | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordsMismatch: true };
  }

  setPassword(password: any): void {
    if (this.passwordForm.valid) {
      // Send password to the backend
      this.http.post('/api/set-password/', { password }).subscribe({
        next: (response: any) => {
          this.successMessage = 'Password set successfully!';
          setTimeout(() => this.router.navigate(['/login']), 2000); // Redirect to login after success
        },
        error: (error) => {
          this.errorMessage = 'An error occurred. Please try again.';
        }
      });
    }
  }
}
