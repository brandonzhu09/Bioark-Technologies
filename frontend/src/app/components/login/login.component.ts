import { Component } from '@angular/core';
import { FormControl, Validators, FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule],
})
export class LoginComponent {

  constructor(private authService: AuthService, private router: Router) { }

  loginForm = new FormGroup({
    email: new FormControl('', [
      Validators.required,
    ]),
    password: new FormControl('', [
      Validators.required
    ]),
  });

  onSubmit(credentials: any) {
    this.authService.login(credentials).subscribe(
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
