import { Component, OnInit } from '@angular/core';
import { BorrowingService } from '../../core/services/borrowing.service';
import { Borrowing } from '../../core/models/borrowing.model';
import { BorrowingStatus } from '../../shared/enums/borrowing-status.enum';

@Component({
  selector: 'app-borrowings',
  standalone: false,
  templateUrl: './borrowings.html',
  styleUrl: './borrowings.scss',
})
export class BorrowingsComponent implements OnInit {
  borrowings: Borrowing[] = [];
  filteredBorrowings: Borrowing[] = [];
  loading: boolean = false;
  
  // Filter
  statusFilter: string = '';
  
  statusOptions = [
    { label: 'All Status', value: '' },
    { label: 'Borrowed', value: BorrowingStatus.BORROWED },
    { label: 'Overdue', value: BorrowingStatus.OVERDUE }
  ];

  BorrowingStatus = BorrowingStatus;

  constructor(private borrowingService: BorrowingService) {}

  ngOnInit(): void {
    this.loadBorrowings();
  }

  loadBorrowings(): void {
    this.loading = true;
    this.borrowingService.getAllBorrowings().subscribe({
      next: (data) => {
        // Filter out returned books - only show borrowed and overdue
        this.borrowings = data.filter(b => b.status !== BorrowingStatus.RETURNED);
        this.filteredBorrowings = this.borrowings;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading borrowings:', error);
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    this.filteredBorrowings = this.borrowings.filter(borrowing => {
      const matchesStatus = !this.statusFilter || borrowing.status === this.statusFilter;
      return matchesStatus;
    });
  }

  clearFilters(): void {
    this.statusFilter = '';
    this.filteredBorrowings = this.borrowings;
  }

  returnBook(borrowing: Borrowing): void {
    if (!borrowing.id) {
      return;
    }

    this.borrowingService.returnBook(borrowing.id).subscribe({
      next: () => {
        this.loadBorrowings();
        alert(`Book "${borrowing.book.title}" returned successfully!`);
      },
      error: (error) => {
        console.error('Error returning book:', error);
        const errorMessage = error.error?.message || 'Failed to return book. Please try again.';
        alert(errorMessage);
      }
    });
  }

  getStatusSeverity(status: BorrowingStatus): 'success' | 'warn' | 'danger' | 'info' {
    switch (status) {
      case BorrowingStatus.RETURNED:
        return 'success';
      case BorrowingStatus.OVERDUE:
        return 'danger';
      case BorrowingStatus.BORROWED:
        return 'info';
      default:
        return 'info';
    }
  }

  getMemberFullName(borrowing: Borrowing): string {
    return `${borrowing.member.firstName} ${borrowing.member.lastName}`;
  }

  canReturn(borrowing: Borrowing): boolean {
    return borrowing.status === BorrowingStatus.BORROWED || 
           borrowing.status === BorrowingStatus.OVERDUE;
  }
}
