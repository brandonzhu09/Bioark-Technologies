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

  infoForm: FormGroup = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    institution: new FormControl(''),
    address: new FormControl(''),
    city: new FormControl(''),
    state: new FormControl(''),
    zipcode: new FormControl(''),
  });;

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
        city: res?.['shipping_address']?.['city'],
        state: res?.['shipping_address']?.['state'],
        zipcode: res?.['shipping_address']?.['zipcode'],
      });
    });
  }

  onSubmit() {
    if (this.infoForm.valid) {
      console.log(this.infoForm.value)
      this.userService.updateUserInfo(this.infoForm.value).subscribe();
    }
  }

}
