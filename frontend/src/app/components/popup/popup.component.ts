import { Component } from '@angular/core';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrl: './popup.component.css'
})
export class PopupComponent {
  showPopup = true;
  productName = '';

  togglePopup() {
    this.showPopup = !this.showPopup;
  }

}
