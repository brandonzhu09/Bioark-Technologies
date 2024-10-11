import { Component } from '@angular/core';
import {FormControl, Validators, FormsModule, ReactiveFormsModule, FormGroup} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule],
})
export class LoginComponent {

  constructor(private authService: AuthService) {}

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
          console.log("yay")
        } else {
          console.log("nay")
        }
      }
    );
  }
}
