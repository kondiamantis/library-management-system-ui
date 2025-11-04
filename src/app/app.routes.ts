import { Routes } from '@angular/router';
import { Dashboard } from './features/dashboard/dashboard';
import { Books } from './features/books/books';
import { Members } from './features/members/members';
import { Borrowings } from './features/borrowings/borrowings';

export const routes: Routes = [
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: Dashboard },
    { path: 'books', component: Books },
    { path: 'members', component: Members },
    { path: 'borrowings', component: Borrowings },
  ];