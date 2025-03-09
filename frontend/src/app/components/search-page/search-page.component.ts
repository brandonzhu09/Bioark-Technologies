import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchService } from '../../services/search.service';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.css'
})
export class SearchPageComponent {

  constructor(private route: ActivatedRoute, private searchService: SearchService, private router: Router) { }

  query: string = '';
  length: number = 0;
  search_results: any[] = [];
  page_size: string = '10';
  page_number: string = '1';

  ngOnInit() {
    this.route.queryParamMap.subscribe((params) => {
      this.query = params.get('q')!;
      this.page_size = params.get('page_size') || '10';
      this.page_number = params.get('page_number') || '1';
      this.search();
    });
  }

  search() {
    this.searchService.search(this.query, this.page_size, this.page_number).subscribe((res) => {
      this.length = res.length;
      this.search_results = res.results;
    });
  }

  handlePageEvent(event: any) {
    this.router.navigate(['/search'], { queryParams: { q: this.query, page_number: event.pageIndex + 1, page_size: event.pageSize } });
  }

}
