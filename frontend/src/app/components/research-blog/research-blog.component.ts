import { Component } from '@angular/core';
import { LandingPageService } from '../../services/landing.service';

@Component({
  selector: 'research-blog',
  templateUrl: './research-blog.component.html',
  styleUrl: './research-blog.component.css'
})
export class ResearchBlogComponent {

  constructor(private landingPageService: LandingPageService) { }

  blogsData = this.landingPageService.get_blogs();
}
