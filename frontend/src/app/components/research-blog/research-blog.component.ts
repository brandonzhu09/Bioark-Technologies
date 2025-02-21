import { Component } from '@angular/core';
import { LandingPageService } from '../../services/landing.service';
import { BlogService } from '../../services/blog.service';

@Component({
  selector: 'research-blog',
  templateUrl: './research-blog.component.html',
  styleUrl: './research-blog.component.css'
})
export class ResearchBlogComponent {

  constructor(private blogService: BlogService) { }

  blogs: any = [{}, {}, {}, {}];

  ngOnInit() {
    // this.blogService.getLatestBlogs().subscribe((data) => {
    //   this.blogs = data;
    // });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  }

}
