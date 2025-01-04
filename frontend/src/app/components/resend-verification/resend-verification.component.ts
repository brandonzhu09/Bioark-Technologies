import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-resend-verification',
  templateUrl: './resend-verification.component.html',
  styleUrl: './resend-verification.component.css'
})
export class ResendVerificationComponent {

  successMsg: string = '';
  errorMsg: string = '';

  emailForm = new FormGroup({
    email: new FormControl('', Validators.required),
  })

  constructor(private authService: AuthService) { }

  submitEmail() {
    if (this.emailForm.valid) {
      this.authService.resendVerification(this.emailForm.value).subscribe(
        (res) => {
          console.log(res)
          this.successMsg = res.detail;
          this.errorMsg = '';
        },
        (err) => {
          this.errorMsg = err.error.detail;
          this.successMsg = '';
        });
    }
  }
}
