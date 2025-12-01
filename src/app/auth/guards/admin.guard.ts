import { Injectable } from '@angular/core';
<<<<<<< HEAD
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
=======
import { Router, UrlTree } from '@angular/router';
>>>>>>> features/authentication
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
<<<<<<< HEAD
export class AdminGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    if (this.authService.isLoggedIn && this.authService.isAdmin) {
      return true;
    }

=======
export class AdminGuard {
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean | UrlTree {
    if (this.authService.isLoggedIn() && this.authService.isAdmin()) {
      return true;
    }
    
    // Not admin, redirect to dashboard
>>>>>>> features/authentication
    return this.router.createUrlTree(['/dashboard']);
  }
}

