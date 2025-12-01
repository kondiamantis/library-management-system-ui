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
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    if (this.authService.isLoggedIn) {
      return true;
    }

    return this.router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
=======
export class AuthGuard {
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean | UrlTree {
    if (this.authService.isLoggedIn()) {
      return true;
    }
    
    // Not logged in, redirect to login page
    return this.router.createUrlTree(['/login']);
>>>>>>> features/authentication
  }
}

