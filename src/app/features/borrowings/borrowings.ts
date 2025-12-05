import { Component, OnInit } from '@angular/core';
import { BorrowingService } from '../../core/services/borrowing.service';
import { AuthService } from '../../auth/services/auth.service';
import { Borrowing } from '../../core/models/borrowing.model';
import { BorrowingStatus } from '../../shared/enums/borrowing-status.enum';
import { MessageService, ConfirmationService } from 'primeng/api';

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

  constructor(
    private borrowingService: BorrowingService,
    private authService: AuthService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.loadBorrowings();
  }

  loadBorrowings(): void {
    this.loading = true;
    
    if (this.authService.isMember) {
      // Members: Load only their own borrowings using user ID
      const currentUserId = this.authService.currentUserValue?.id;
      if (currentUserId) {
        this.borrowingService.getBorrowingsByUser(currentUserId).subscribe({
          next: (data) => {
            // Filter out returned books
            this.borrowings = data.filter(b => b.status !== BorrowingStatus.RETURNED);
            this.filteredBorrowings = this.borrowings;
            this.loading = false;
          },
          error: (error) => {
            console.error('Error loading member borrowings:', error);
            this.loading = false;
          }
        });
      } else {
        this.borrowings = [];
        this.filteredBorrowings = [];
        this.loading = false;
      }
    } else {
      // Admins: Load all borrowings
      this.borrowingService.getAllBorrowings().subscribe({
        next: (data) => {
          // Filter out returned books
          this.borrowings = data.filter(b => b.status !== BorrowingStatus.RETURNED);
          this.filteredBorrowings = this.borrowings;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading all borrowings:', error);
          this.loading = false;
        }
      });
    }
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

  confirmReturnBook(borrowing: Borrowing): void {
    if (!borrowing.id) {
      return;
    }

    this.confirmationService.confirm({
      message: `Are you sure you want to return "${borrowing.book.title}"?`,
      header: 'Return Book Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-info',
      rejectButtonStyleClass: 'p-button-secondary',
      accept: () => {
        this.returnBook(borrowing);
      }
    });
  }

  returnBook(borrowing: Borrowing): void {
    if (!borrowing.id) {
      return;
    }

    this.borrowingService.returnBook(borrowing.id).subscribe({
      next: () => {
        this.loadBorrowings();
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `Book "${borrowing.book.title}" returned successfully!`
        });
      },
      error: (error) => {
        console.error('Error returning book:', error);
        const errorMessage = error.error?.message || 'Failed to return book. Please try again.';
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: errorMessage
        });
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
    const statusAllowsReturn = borrowing.status === BorrowingStatus.BORROWED || 
                               borrowing.status === BorrowingStatus.OVERDUE;
    
    // Since members only see their own borrowings (filtered by user ID),
    // they can return any borrowing in their list
    // Admins see all borrowings and can return any
    return statusAllowsReturn;
  }

  // Role-based permissions
  get isAdmin(): boolean {
    return this.authService.isAdmin;
  }

  get isMember(): boolean {
    return this.authService.isMember;
  }
}
