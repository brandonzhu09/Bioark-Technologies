import { Component } from '@angular/core';
import { US_STATES } from '../../../../references';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrl: './user-page.component.css'
})
export class UserPageComponent {
  states: any[] = US_STATES;
}
