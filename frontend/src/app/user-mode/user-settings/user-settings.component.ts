import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrl: './user-settings.component.css'
})
export class UserSettingsComponent {
  StrongPasswordRegx: RegExp = /^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d).{8,}$/;
  resetEmailForm = new FormGroup({
    email: new FormControl('', [Validators.required])
  })
  resetPasswordForm = new FormGroup({
    currentPassword: new FormControl('', [Validators.required]),
    newPassword: new FormControl('', [Validators.required, Validators.pattern(this.StrongPasswordRegx)]),
    confirmPassword: new FormControl('', [Validators.required])
  })

  email: string = '';
  emailSuccessMsg: string = '';
  emailErrorMsg: string = '';
  passwordSuccessMsg: string = '';
  passwordErrorMsg: string = '';

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit() {
    this.userService.getUserEmail().subscribe(res => {
      this.email = res.email;
    })
  }

  submitEmail() {
    if (this.resetEmailForm.valid) {
      this.userService.resetUserEmail(this.resetEmailForm.value).subscribe(
        (res) => {
          window.location.reload()
          this.emailSuccessMsg = res.detail;
          this.emailErrorMsg = '';
        },
        (err) => {
          this.emailErrorMsg = err.error.detail;
          this.emailSuccessMsg = '';
        }
      )
    }
  }

  submitPassword() {
    if (this.resetPasswordForm.valid) {
      this.userService.resetUserPassword(this.resetPasswordForm.value).subscribe(
        (res) => {
          this.passwordSuccessMsg = res.detail;
          this.passwordErrorMsg = '';
          alert("Password successfully reset. You must log back in to stay signed in.")
          this.router.navigate(["/login"]).then(() => {
            window.location.reload()
          })
        },
        (err) => {
          this.passwordErrorMsg = err.error.detail;
          this.passwordSuccessMsg = '';
        }
      )
    }
  }

}
