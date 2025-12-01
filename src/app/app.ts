import { Component, signal } from '@angular/core';
<<<<<<< HEAD
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
=======
>>>>>>> features/authentication
import { AuthService } from './auth/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('library-management-system-ui');
<<<<<<< HEAD
  showNavbar: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.showNavbar = !['/login', '/signup'].includes(event.urlAfterRedirects);
    });
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn;
=======

  constructor(private authService: AuthService) {}

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
>>>>>>> features/authentication
  }
}
