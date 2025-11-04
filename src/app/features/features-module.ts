import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
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

@NgModule({
  declarations: [
    BooksComponent,
    MembersComponent,
    DashboardComponent,
    BorrowingsComponent,
  ],
  imports: [
    CommonModule,
    ButtonModule,
    TagModule,
    BadgeModule,
    OverlayBadgeModule,
    CardModule,
    ChartModule,
    TableModule
  ],
  exports: [
    BooksComponent,
    MembersComponent,
    DashboardComponent,
    BorrowingsComponent
  ]
})
export class FeaturesModule { }
