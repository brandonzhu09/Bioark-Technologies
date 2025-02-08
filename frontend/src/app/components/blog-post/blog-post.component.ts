import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BlogService } from '../../services/blog.service';
import { environment } from '../../../environment/environment';

@Component({
  selector: 'blog-post',
  templateUrl: './blog-post.component.html',
  styleUrl: './blog-post.component.css'
})
export class BlogPostComponent {
  blogId: string = '';

  title: string = '';
  author: string = '';
  datePosted: string = '';
  content: string = '';
  imageUrl: string = '';

  constructor(private route: ActivatedRoute, private blogService: BlogService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.blogId = params['id'];
      this.getBlog();
    });
  }

  getBlog() {
    // Call the blog service to get the blog
    this.blogService.getBlog(this.blogId).subscribe((response) => {
      console.log(response);
      this.title = response.title;
      this.author = response.author;
      this.datePosted = response.date_posted;
      this.content = response.content;
      this.imageUrl = response.image;
    });
  }

  get fullImageUrl(): string {
    return environment.apiBaseUrl + this.imageUrl;
  }
}
