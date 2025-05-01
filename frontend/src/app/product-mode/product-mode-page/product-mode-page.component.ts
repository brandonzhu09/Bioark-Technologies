import { Component, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InterfaceService } from '../../services/interface.service';

@Component({
  selector: 'app-product-mode-page',
  templateUrl: './product-mode-page.component.html',
  styleUrl: './product-mode-page.component.css',
  encapsulation: ViewEncapsulation.None
})
export class ProductModePageComponent {
  url: string = '';
  title: string = '';
  content: string = '';
  raw_html: string = '';
  activeTab: string = 'tab-1';

  constructor(private route: ActivatedRoute, private interfaceService: InterfaceService, private router: Router) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.url = params['url'];
      this.getProductPage();
    });
  }

  getProductPage() {
    this.interfaceService.getProductPage(this.url).subscribe(res => {
      this.title = res.title;
      this.content = res.content;
      this.raw_html = res.raw_html;
    })
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  goToQuotePage(product: string) {
    this.router.navigate(['/message'], { queryParams: { 'product': product } });
  }

}
