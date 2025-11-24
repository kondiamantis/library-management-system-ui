import { Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard';
import { BooksComponent } from './features/books/books';
import { MembersComponent } from './features/members/members';
import { BorrowingsComponent } from './features/borrowings/borrowings';
import { LoginComponent } from './auth/pages/login/login';
import { SignupComponent } from './auth/pages/signup/signup';
import { AuthGuard } from './auth/guards/auth.guard';
import { AdminGuard } from './auth/guards/admin.guard';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent },
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
    { path: 'books', component: BooksComponent, canActivate: [AuthGuard] },
    { path: 'members', component: MembersComponent, canActivate: [AuthGuard] },
    { path: 'borrowings', component: BorrowingsComponent, canActivate: [AuthGuard] },
    { path: '**', redirectTo: '/dashboard' }
  ];