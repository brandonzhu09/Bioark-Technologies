import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'cart-popup',
  standalone: true,
  templateUrl: './popup.component.html',
  styleUrl: './popup.component.css',
  imports: [CommonModule]
})
export class PopupComponent {
  @Input() showPopup = false;
  @Input() items: any = [];
  productName = '';

  togglePopup() {
    this.showPopup = !this.showPopup;
  }

}
