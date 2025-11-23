import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BooksComponent } from './books/books';
import { MembersComponent } from './members/members';
import { DashboardComponent } from './dashboard/dashboard';
import { BorrowingsComponent } from './borrowings/borrowings';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { BadgeModule } from 'primeng/badge';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';
import { SkeletonModule } from 'primeng/skeleton';
import { SelectButtonModule } from 'primeng/selectbutton';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { ProgressBarModule } from 'primeng/progressbar';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { SelectModule } from 'primeng/select';
import { FloatLabelModule } from 'primeng/floatlabel';

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
    TagModule,
    BadgeModule,
    OverlayBadgeModule,
    CardModule,
    ChartModule,
    TableModule,
    SkeletonModule,
    SelectButtonModule,
    InputTextModule,
    MultiSelectModule,
    AutoCompleteModule,
    SelectModule,
    FloatLabelModule,
    DialogModule,
    InputNumberModule,
    ProgressBarModule,
  ],
  exports: [
    BooksComponent,
    MembersComponent,
    DashboardComponent,
    BorrowingsComponent
  ]
})
export class FeaturesModule { }
