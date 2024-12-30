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

  passwordForm = new FormGroup({
    password: new FormControl('', Validators.required),
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
    if (this.passwordForm.valid && this.passwordForm.value.password === this.passwordForm.value.confirmPassword && this.email !== '') {
      this.authService.signup({ 'email': this.email, 'password': this.passwordForm.value.password }).subscribe();
      this.router.navigate(['/checkout']).then(() => {
        window.location.reload()
      })
    }
  }

}
