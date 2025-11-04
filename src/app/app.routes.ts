import { Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard';
import { BooksComponent } from './features/books/books';
import { MembersComponent } from './features/members/members';
import { BorrowingsComponent } from './features/borrowings/borrowings';

export const routes: Routes = [
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'books', component: BooksComponent },
    { path: 'members', component: MembersComponent   },
    { path: 'borrowings', component: BorrowingsComponent   },
  ];