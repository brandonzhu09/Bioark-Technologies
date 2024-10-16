import { Component, inject } from '@angular/core';
import { LandingPageService } from '../../services/landing.service';

@Component({
  selector: 'service-list',
  templateUrl: './service-list.component.html',
  styleUrl: './service-list.component.css'
})
export class ServiceListComponent {
  private serviceService = inject(LandingPageService);
  servicesData = this.serviceService.get_services();
}
