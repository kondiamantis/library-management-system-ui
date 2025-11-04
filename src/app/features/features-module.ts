import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Books } from './books/books';
import { Members } from './members/members';
import { Dashboard } from './dashboard/dashboard';
import { Borrowings } from './borrowings/borrowings';

@NgModule({
  declarations: [
    Books,
    Members,
    Dashboard,
    Borrowings
  ],
  imports: [
    CommonModule
  ],
  exports: [
    Books,
    Members,
    Dashboard,
    Borrowings
  ]
})
export class FeaturesModule { }
