import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.css'
})
export class SearchPageComponent {

  constructor(private route: ActivatedRoute) { }

  query: string = '';
  length: number = 0;

  handlePageEvent(event: any) { }

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.query = params.get('q')!;
      console.log(this.query);
    });
  }

}
