import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { AuthService } from '../../auth/services/auth.service';
import { ThemeService } from '../../core/services/theme.service';
import { User } from '../../auth/models/user.model';
import { Role } from '../../shared/enums/role.enum';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar implements OnInit, OnDestroy {
  items: MenuItem[] = [];
  currentUser: User | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private authService: AuthService,
    private themeService: ThemeService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        this.currentUser = user;
        this.updateMenuItems();
      });

    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.updateMenuItems();
      });

    this.updateMenuItems();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  updateMenuItems(): void {
    const currentUrl = this.router.url;
    const isAdmin = this.currentUser?.role === Role.ADMIN;

    this.items = [
      {
        label: 'Home',
        icon: 'pi pi-home',
        routerLink: '/dashboard',
        styleClass: currentUrl.includes('/dashboard') ? 'active-menu-item' : ''
      },
      {
        label: 'Books',
        icon: 'pi pi-book',
        routerLink: '/books',
        styleClass: currentUrl.includes('/books') ? 'active-menu-item' : ''
      },
      {
        label: 'Members',
        icon: 'pi pi-user',
        routerLink: '/members',
        visible: isAdmin,
        styleClass: currentUrl.includes('/members') ? 'active-menu-item' : ''
      },
      {
        label: 'Borrowings',
        icon: 'pi pi-book',
        routerLink: '/borrowings',
        styleClass: currentUrl.includes('/borrowings') ? 'active-menu-item' : ''
      }
    ];
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
