import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { User } from '../models/user.model';
import { AuthResponse } from '../models/auth-response.model';
import { LoginRequest } from '../models/login-request.model';
import { SignupRequest } from '../models/signup-request.model';
import { Role } from '../../shared/enums/role.enum';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  constructor(private http: HttpClient, private router: Router) {
    const storedUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<User | null>(
      storedUser ? JSON.parse(storedUser) : null
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  public get isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }

  public get isAdmin(): boolean {
    return this.currentUserSubject.value?.role === Role.ADMIN;
  }

  public get isMember(): boolean {
    return this.currentUserSubject.value?.role === Role.MEMBER;
  }

  public get isUserActive(): boolean {
    const user = this.currentUserSubject.value;
    // Admins are always considered active
    if (user?.role === Role.ADMIN) {
      return true;
    }
    // For members, check isActive status
    return user?.isActive ?? false;
  }

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, request).pipe(
      map(response => {
        // Check if user is active (for members)
        if (response.role === Role.MEMBER && response.isActive === false) {
          throw new Error('Your account has been deactivated. Please contact an administrator.');
        }
        return response;
      }),
      tap(response => {
        const user: User = {
          id: response.id,
          email: response.email,
          firstName: response.firstName,
          lastName: response.lastName,
          role: response.role,
          isActive: response.isActive ?? true // Use response value or default to true for admins
        };
        localStorage.setItem('jwtToken', response.token);
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
      }),
      catchError(this.handleError)
    );
  }

  signup(request: SignupRequest): Observable<string> {
    return this.http.post(`${this.apiUrl}/signup`, request, { responseType: 'text' }).pipe(
      catchError(this.handleError)
    );
  }

  logout(): void {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('jwtToken');
  }

  getUserFullName(): string {
    const user = this.currentUserValue;
    return user ? `${user.firstName} ${user.lastName}` : '';
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      if (error.status === 400 && error.error) {
        errorMessage = typeof error.error === 'string' ? error.error : error.error.message || 'Bad request';
      } else if (error.status === 401) {
        errorMessage = 'Invalid credentials. Please try again.';
      } else if (error.status === 403) {
        // Extract message from 403 Forbidden response
        // Backend returns string directly in body
        if (typeof error.error === 'string') {
          errorMessage = error.error;
        } else if (error.error && typeof error.error === 'object' && error.error.message) {
          errorMessage = error.error.message;
        } else {
          errorMessage = 'Your account has been deactivated. Please contact an administrator.';
        }
      } else {
        // For other errors, try to extract message
        if (typeof error.error === 'string') {
          errorMessage = error.error;
        } else if (error.error?.message) {
          errorMessage = error.error.message;
        } else {
          errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }
      }
    }
    
    console.error('Auth Error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}

