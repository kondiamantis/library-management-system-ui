import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../auth/services/auth.service';
import { ThemeService } from '../../core/services/theme.service';
import { User } from '../../auth/models/user.model';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar implements OnInit {
  items: MenuItem[] = [];
  currentUser: User | null = null;

  constructor(
    private router: Router,
    private authService: AuthService,
    private themeService: ThemeService
  ) {}

  ngOnInit(): void {
    // Subscribe to current user
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.buildMenu();
    });

    // Set active item on init and on route changes
    this.setActiveItem(this.router.url);
    
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.setActiveItem(event.url);
      });
  }

  private buildMenu(): void {
    this.items = [
      {
        label: 'Home',
        icon: 'pi pi-home',
        routerLink: '/dashboard'
      },
      {
        label: 'Books',
        icon: 'pi pi-book',
        routerLink: '/books'
      },
      {
        label: 'Borrowings',
        icon: 'pi pi-calendar',
        routerLink: '/borrowings'
      }
    ];

    // Add Members menu only for admin
    if (this.authService.isAdmin()) {
      this.items.push({
        label: 'Members',
        icon: 'pi pi-users',
        routerLink: '/members'
      });
    }
  }

  private setActiveItem(url: string): void {
    this.items.forEach(item => {
      item.styleClass = item.routerLink === url ? 'active-menu-item' : '';
    });
  }

  getUserFullName(): string {
    return this.authService.getUserFullName();
  }

  logout(): void {
    this.authService.logout();
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  isDarkMode(): boolean {
    return this.themeService.isDarkMode();
  }
}
