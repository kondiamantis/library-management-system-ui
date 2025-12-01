<<<<<<< HEAD
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoginRequest } from '../../models/login-request.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
=======
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoginRequest } from '../../models/login-request.model';
>>>>>>> features/authentication

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
<<<<<<< HEAD
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    if (this.authService.isLoggedIn) {
=======
export class LoginComponent {
  loginRequest: LoginRequest = {
    email: '',
    password: ''
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

    if (this.loginForm.invalid) {
      this.loading = false;
      this.errorMessage = 'Please enter valid email and password.';
      return;
    }

    const { email, password } = this.loginForm.value;
    const loginRequest: LoginRequest = { email, password };

    this.authService.login(loginRequest).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.errorMessage = err.message || 'Login failed. Please check your credentials.';
=======
    if (!this.loginRequest.email || !this.loginRequest.password) {
      this.errorMessage = 'Please fill in all fields';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.authService.login(this.loginRequest).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.error('Login error:', error);
        this.errorMessage = error.error?.message || 'Invalid email or password';
>>>>>>> features/authentication
        this.loading = false;
      }
    });
  }
<<<<<<< HEAD
=======

  goToSignup(): void {
    this.router.navigate(['/signup']);
  }
>>>>>>> features/authentication
}

