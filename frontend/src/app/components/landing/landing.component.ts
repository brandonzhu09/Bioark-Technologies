import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent {

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.getSession().subscribe((response) => {
      if (response.isAuthenticated) {
        this.authService.isAuthenticated = true;
      }
      else {
        this.authService.isAuthenticated = false;
      }
    });
  }
}
