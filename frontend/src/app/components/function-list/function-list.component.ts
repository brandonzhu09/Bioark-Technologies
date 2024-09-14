import { Component, Input, inject } from '@angular/core';
import { LandingPageService } from '../../services/landing.service';

@Component({
  selector: 'function-list',
  templateUrl: './function-list.component.html',
  styleUrl: './function-list.component.css'
})
export class FunctionListComponent {
  @Input() heading = "";

  private landingPageService = inject(LandingPageService);

  functionsData = this.landingPageService.get_functions();

}
