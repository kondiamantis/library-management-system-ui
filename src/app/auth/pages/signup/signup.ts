import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { SignupRequest } from '../../models/signup-request.model';

@Component({
  selector: 'app-signup',
  standalone: false,
  templateUrl: './signup.html',
  styleUrl: './signup.scss'
})
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
      this.router.navigate(['/dashboard']);
    }
  }

  onSubmit(): void {
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
        this.loading = false;
      }
    });
  }
}

