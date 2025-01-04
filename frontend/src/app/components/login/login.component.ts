import { Component } from '@angular/core';
import { FormControl, Validators, FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  redirectUrl: string = ''

  constructor(private authService: AuthService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    // Extract the redirectUrl query parameter, if any
    this.route.queryParams.subscribe(params => {
      this.redirectUrl = params['redirectUrl'] || '';
    });
  }

  loginForm = new FormGroup({
    email: new FormControl('', [
      Validators.required,
    ]),
    password: new FormControl('', [
      Validators.required
    ]),
  });

  errorMessage: string = '';

  onSubmit(credentials: any) {
    this.authService.login(credentials).subscribe(
      (response) => {
        if (response.success) {
          this.onLoginSuccess()
        } else {
          this.authService.isAuthenticated = false;
          this.errorMessage = "Incorrect email or password. Try again."
        }
      },
      (error) => {
        console.log(error)
        this.authService.isAuthenticated = false;
        this.errorMessage = "Incorrect email or password. Try again."
      }
    );
  }

  onLoginSuccess() {
    this.router.navigate(['/' + this.redirectUrl]).then(() => {
      window.location.reload();
    });
    this.authService.isAuthenticated = true;
  }
}
