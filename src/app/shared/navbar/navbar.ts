import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar implements OnInit {
  items: MenuItem[] = [];

  constructor(private router: Router) {}

  ngOnInit(): void {
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
        label: 'Members',
        icon: 'pi pi-user',
        routerLink: '/members'
      },
      {
        label: 'Borrowings',
        icon: 'pi pi-book',
        routerLink: '/borrowings'
      }
    ];

    // Set active item on init and on route changes
    this.setActiveItem(this.router.url);
    
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.setActiveItem(event.url);
      });
  }

  private setActiveItem(url: string): void {
    this.items.forEach(item => {
      item.styleClass = item.routerLink === url ? 'active-menu-item' : '';
    });
  }
}
