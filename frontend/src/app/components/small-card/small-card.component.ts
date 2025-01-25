import { Component, Input } from '@angular/core';

@Component({
  selector: 'small-card',
  templateUrl: './small-card.component.html',
  styleUrl: './small-card.component.css'
})
export class SmallCardComponent {
  @Input() name!: string;
  @Input() description!: string;
  @Input() link!: string;
  @Input() image!: string;


}
