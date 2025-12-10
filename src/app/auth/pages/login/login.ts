import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoginRequest } from '../../models/login-request.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    if (this.authService.isLoggedIn) {
      this.router.navigate(['/dashboard']);
    }
  }

  onSubmit(): void {
    this.loading = true;
    this.errorMessage = null;

    if (this.loginForm.invalid) {
      this.loading = false;
      this.messageService.add({
        severity: 'warn',
        summary: 'Validation Error',
        detail: 'Please enter valid email and password.',
        life: 3000
      });
      return;
    }

    const { email, password } = this.loginForm.value;
    const loginRequest: LoginRequest = { email, password };

    this.authService.login(loginRequest).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        const errorMsg = err.message || 'Login failed. Please check your credentials.';
        
        // Show error toast with appropriate severity
        const isAccountDeactivated = errorMsg.toLowerCase().includes('deactivated');
        
        this.messageService.add({
          severity: isAccountDeactivated ? 'error' : 'warn',
          summary: isAccountDeactivated ? 'Account Deactivated' : 'Login Failed',
          detail: errorMsg,
          life: 5000,
          icon: isAccountDeactivated ? 'pi pi-ban' : 'pi pi-exclamation-triangle'
        });
        
        this.loading = false;
      }
    });
  }
}

