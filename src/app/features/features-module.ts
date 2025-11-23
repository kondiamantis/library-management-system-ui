import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BooksComponent } from './books/books';
import { MembersComponent } from './members/members';
import { DashboardComponent } from './dashboard/dashboard';
import { BorrowingsComponent } from './borrowings/borrowings';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DrawerModule } from 'primeng/drawer';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmationService } from 'primeng/api';

@NgModule({
  declarations: [
    BooksComponent,
    MembersComponent,
    DashboardComponent,
    BorrowingsComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    CardModule,
    TableModule,
    InputTextModule,
    FloatLabelModule,
    ConfirmDialogModule,
    DrawerModule,
    DialogModule,
    InputNumberModule,
    SelectModule,
    TextareaModule,
    IconFieldModule,
    InputIconModule,
    TagModule,
    TooltipModule,
  ],
  exports: [
    BooksComponent,
    MembersComponent,
    DashboardComponent,
    BorrowingsComponent
  ],
  providers: [
    ConfirmationService
  ]
})
export class FeaturesModule { }
