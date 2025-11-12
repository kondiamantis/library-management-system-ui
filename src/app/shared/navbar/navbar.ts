import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  items: MenuItem[] | undefined;

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
  }

}
