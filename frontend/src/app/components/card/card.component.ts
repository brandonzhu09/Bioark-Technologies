import { Component, Input } from '@angular/core';

@Component({
  selector: 'card',
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent {
  @Input() name: string = '';
  @Input() date: string = '';
  @Input() description: string = '';
  @Input() link: string = '/';
  @Input() image: string | undefined = '';

}
