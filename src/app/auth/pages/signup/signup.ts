import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { SignupRequest } from '../../models/signup-request.model';

@Component({
  selector: 'app-signup',
  standalone: false,
  templateUrl: './signup.html',
  styleUrl: './signup.scss'
})
export class SignupComponent {
  signupRequest: SignupRequest = {
    email: '',
    password: '',
    firstName: '',
    lastName: ''
  };

  errorMessage: string = '';
  loading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    // Redirect if already logged in
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }
  }

  onSubmit(): void {
    if (!this.signupRequest.email || !this.signupRequest.password || 
        !this.signupRequest.firstName || !this.signupRequest.lastName) {
      this.errorMessage = 'Please fill in all fields';
      return;
    }

    if (this.signupRequest.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.authService.signup(this.signupRequest).subscribe({
      next: () => {
        alert('Account created successfully! Please login.');
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Signup error:', error);
        this.errorMessage = error.error || 'Failed to create account. Please try again.';
        this.loading = false;
      }
    });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}

