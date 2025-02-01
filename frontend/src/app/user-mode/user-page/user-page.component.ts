import { Component } from '@angular/core';
import { US_STATES } from '../../../../references';
import { UserService } from '../../services/user.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrl: './user-page.component.css'
})
export class UserPageComponent {
  states: any[] = US_STATES;
  successMsg: string = '';
  errorMsg: string = '';

  infoForm: FormGroup = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    institution: new FormControl(''),
    address: new FormControl('', Validators.required),
    apt: new FormControl(''),
    city: new FormControl('', Validators.required),
    state: new FormControl('', Validators.required),
    zipcode: new FormControl('', Validators.required),
  });

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    // Populate the FormGroup with data from the Observable
    this.userService.viewUserInfo().subscribe((res) => {
      console.log(res)
      this.infoForm.patchValue({
        firstName: res?.['first_name'],
        lastName: res?.['last_name'],
        institution: res?.['company'],
        address: res?.['shipping_address']?.['address_line_1'],
        apt: res?.['shipping_address']?.['apt_suite'],
        city: res?.['shipping_address']?.['city'],
        state: res?.['shipping_address']?.['state'],
        zipcode: res?.['shipping_address']?.['zipcode'],
      });
    });
  }

  onSubmit() {
    if (this.infoForm.valid) {
      console.log(this.infoForm.value)
      this.userService.updateUserInfo(this.infoForm.value).subscribe(
        (res) => {
          this.successMsg = 'Information updated successfully!';
          this.errorMsg = '';
        },
        (err) => {
          this.errorMsg = 'An error occurred. Please try again.';
          this.successMsg = '';
        }
      );
    }
  }

}
