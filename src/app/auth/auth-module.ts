import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
<<<<<<< HEAD
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
=======
import { FormsModule } from '@angular/forms';
>>>>>>> features/authentication
import { LoginComponent } from './pages/login/login';
import { SignupComponent } from './pages/signup/signup';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
<<<<<<< HEAD
import { CardModule } from 'primeng/card';
import { PasswordModule } from 'primeng/password';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
=======
>>>>>>> features/authentication

@NgModule({
  declarations: [
    LoginComponent,
    SignupComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
<<<<<<< HEAD
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    ButtonModule,
    InputTextModule,
    FloatLabelModule,
    CardModule,
    PasswordModule
=======
    ButtonModule,
    InputTextModule,
    FloatLabelModule
>>>>>>> features/authentication
  ],
  exports: [
    LoginComponent,
    SignupComponent
  ]
})
export class AuthModule { }

