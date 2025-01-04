import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-contact-page',
  templateUrl: './contact-page.component.html',
  styleUrl: './contact-page.component.css'
})
export class ContactPageComponent {
  options: google.maps.MapOptions = {
    mapId: "DEMO_MAP_ID",
    center: { lat: 39.095670, lng: -77.131310 },
    zoom: 18,
    draggable: false, // Disables panning (moving the map)
    streetViewControl: false, // Disables Street View
    zoomControl: true, // Optionally enable zoom controls
    scrollwheel: false, // Disables zooming with the scroll wheel
    disableDoubleClickZoom: true, // Disables zooming with double-click
  };

  marker = { position: { lat: 39.095670, lng: -77.131310 } }

  contactForm = new FormGroup({
    firstName: new FormControl('', [
      Validators.required,
      Validators.minLength(1),
    ]),
    lastName: new FormControl('', [
      Validators.required,
      Validators.minLength(1),
    ]),
    email: new FormControl('', [
      Validators.required,
      Validators.email
    ]),
    phone: new FormControl(''),
    subject: new FormControl('', [
      Validators.required,
      Validators.minLength(1),
    ]),
    message: new FormControl('', [
      Validators.required,
      Validators.minLength(1),
    ]),
  });

  successMessage: string = '';
  errorMessage: string = '';

  constructor(private userService: UserService) { }

  onSubmit() {
    if (this.contactForm.valid) {
      this.userService.submitContactForm(this.contactForm.value).subscribe()
      this.successMessage = 'Form submitted! We will get back to you as soon as possible!'
      this.errorMessage = ''
    } else {
      this.successMessage = ''
      this.errorMessage = 'Please complete all required fields.'
    }
  }
}
