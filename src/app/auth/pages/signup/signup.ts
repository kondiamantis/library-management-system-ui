<<<<<<< HEAD
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
=======
import { Component } from '@angular/core';
>>>>>>> features/authentication
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { SignupRequest } from '../../models/signup-request.model';

@Component({
  selector: 'app-signup',
  standalone: false,
  templateUrl: './signup.html',
  styleUrl: './signup.scss'
})
<<<<<<< HEAD
export class SignupComponent implements OnInit {
  signupForm!: FormGroup;
  loading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    if (this.authService.isLoggedIn) {
=======
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
>>>>>>> features/authentication
      this.router.navigate(['/dashboard']);
    }
  }

  onSubmit(): void {
<<<<<<< HEAD
    this.loading = true;
    this.errorMessage = null;
    this.successMessage = null;

    if (this.signupForm.invalid) {
      this.loading = false;
      this.errorMessage = 'Please fill in all required fields correctly.';
      return;
    }

    const { firstName, lastName, email, password } = this.signupForm.value;
    const signupRequest: SignupRequest = { firstName, lastName, email, password };

    this.authService.signup(signupRequest).subscribe({
      next: (response) => {
        this.successMessage = response;
        this.loading = false;
        this.signupForm.reset();
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err) => {
        this.errorMessage = err.message || 'Signup failed. Please try again.';
=======
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
>>>>>>> features/authentication
        this.loading = false;
      }
    });
  }
<<<<<<< HEAD
=======

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
>>>>>>> features/authentication
}

