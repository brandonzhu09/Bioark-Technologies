import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'quantity-input',
  templateUrl: './quantity-input.component.html',
  styleUrl: './quantity-input.component.css',
  standalone: true
})
export class QuantityInputComponent {
  @Input() quantity: number = 1;
  @Output() quantityChange = new EventEmitter<number>();

  increment(): void {
    this.updateQuantity(this.quantity + 1);
  }

  decrement(): void {
    if (this.quantity > 1) {
      this.updateQuantity(this.quantity - 1);
    }
  }

  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    // Remove any non-numeric characters
    input.value = input.value.replace(/[^0-9]/g, '');
  }

  onChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value ? parseInt(input.value, 10) : 1;
    this.updateQuantity(value);
  }

  onBlur(): void {
    // Ensure the value is at least 1 when the input loses focus
    if (!this.quantity || this.quantity < 1) {
      this.updateQuantity(1);
    }
  }

  private updateQuantity(value: number): void {
    this.quantity = value;
    this.quantityChange.emit(this.quantity);
  }
}
