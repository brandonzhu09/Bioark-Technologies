import { Component, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InterfaceService } from '../../services/interface.service';

@Component({
  selector: 'app-service-mode-page',
  templateUrl: './service-mode-page.component.html',
  styleUrl: './service-mode-page.component.css',
  encapsulation: ViewEncapsulation.None
})
export class ServiceModePageComponent {
  url: string = '';
  title: string = '';
  content: string = '';

  constructor(private route: ActivatedRoute, private interfaceService: InterfaceService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.url = params['url'];
      this.getServicePage();
    });
  }

  getServicePage() {
    this.interfaceService.getServicePage(this.url).subscribe(res => {
      this.title = res.title;
      this.content = res.content;
    })
  }
}
