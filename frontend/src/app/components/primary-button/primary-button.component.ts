import { Component, Input } from '@angular/core';

@Component({
  selector: 'primary-button',
  templateUrl: './primary-button.component.html',
  styleUrl: './primary-button.component.css',
  standalone: true
})
export class PrimaryButtonComponent {
  @Input() url: string = '/'

}
