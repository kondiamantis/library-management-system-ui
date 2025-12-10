import { Component, OnInit } from '@angular/core';
import { BookService } from '../../core/services/book.service';
import { BorrowingService } from '../../core/services/borrowing.service';
import { MemberService } from '../../core/services/member.service';
import { AuthService } from '../../auth/services/auth.service';
import { Book } from '../../core/models/book.model';
import { Member } from '../../core/models/member.model';
import { BorrowingRequest } from '../../core/models/borrowing-request.model';
import { BookGenre } from '../../shared/enums/book-genre.enum';
import { BookStatus } from '../../shared/enums/book-status.enum';
import { BorrowingStatus } from '../../shared/enums/borrowing-status.enum';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-books',
  standalone: false,
  templateUrl: './books.html',
  styleUrl: './books.scss',
})
export class BooksComponent implements OnInit {
  books: Book[] = [];
  filteredBooks: Book[] = [];
  loading: boolean = false;
  
  // Filters
  searchTitle: string = '';
  searchAuthor: string = '';
  searchStatus: string = '';
  searchYear: number | null = null;
  searchGenre: string = '';
  
  // Genre options for dropdown - generated from enum
  genreOptions = [
    { label: 'All Genres', value: '' },
    ...Object.values(BookGenre).map(genre => ({
      label: genre,
      value: genre
    }))
  ];
  
  // Status options for dropdown - generated from enum
  statusOptions = [
    { label: 'All Status', value: BookStatus.All },
    { label: 'Available', value: BookStatus.Available },
    { label: 'Low Stock', value: BookStatus.LowStock },
    { label: 'Out of Stock', value: BookStatus.OutOfStock }
  ];
  
  get editGenreOptions() {
    return this.genreOptions.filter(g => g.value !== '');
  }

  // ISBN Validation
  isbnError: string = '';

  validateISBN(isbn: string): boolean {
    this.isbnError = '';
    
    if (!isbn || isbn.trim() === '') {
      this.isbnError = 'ISBN is required';
      return false;
    }

    // Remove hyphens and spaces
    const cleanISBN = isbn.replace(/[-\s]/g, '');

    // Simple format validation - no check digit calculation
    if (cleanISBN.length === 10) {
      // ISBN-10: 10 characters, all digits except last can be X
      if (!/^[\d]{9}[\dX]$/i.test(cleanISBN)) {
        this.isbnError = 'ISBN-10 must be 10 characters (9 digits + 1 digit or X)';
        return false;
      }
      return true;
    } else if (cleanISBN.length === 13) {
      // ISBN-13: 13 digits, must start with 978 or 979
      if (!/^(978|979)\d{10}$/.test(cleanISBN)) {
        this.isbnError = 'ISBN-13 must be 13 digits starting with 978 or 979';
        return false;
      }
      return true;
    } else {
      this.isbnError = 'ISBN must be 10 or 13 digits';
      return false;
    }
  }

  formatISBN(isbn: string): string {
    if (!isbn) return '';
    const cleanISBN = isbn.replace(/[-\s]/g, '');
    
    if (cleanISBN.length === 10) {
      // Format ISBN-10: XXX-X-XXXXX-X
      return `${cleanISBN.substring(0, 3)}-${cleanISBN[3]}-${cleanISBN.substring(4, 9)}-${cleanISBN[9]}`;
    } else if (cleanISBN.length === 13) {
      // Format ISBN-13: XXX-XX-XXXXX-X
      return `${cleanISBN.substring(0, 3)}-${cleanISBN.substring(3, 5)}-${cleanISBN.substring(5, 12)}-${cleanISBN[12]}`;
    }
    
    return isbn;
  }
  
  // Sidebar
  sidebarVisible: boolean = false;
  selectedBook: Book | null = null;
  editMode: boolean = false;
  
  // Edit form
  editedBook: Book = this.getEmptyBook();

  // Borrow dialog
  borrowDialogVisible: boolean = false;
  selectedBookToBorrow: Book | null = null;
  members: Member[] = [];
  selectedMemberId: number | null = null;
  borrowingDays: number = 14;

  constructor(
    private bookService: BookService,
    private borrowingService: BorrowingService,
    private memberService: MemberService,
    public authService: AuthService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(): void {
    this.loading = true;
    this.bookService.getAllBooks().subscribe({
      next: (data) => {
        this.books = data;
        this.filteredBooks = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading books:', error);
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    this.filteredBooks = this.books.filter(book => {
      const matchesTitle = !this.searchTitle || 
        book.title.toLowerCase().includes(this.searchTitle.toLowerCase());
      
      const matchesAuthor = !this.searchAuthor || 
        book.author.toLowerCase().includes(this.searchAuthor.toLowerCase());
      
      const matchesStatus = !this.searchStatus || this.matchesStatusFilter(book, this.searchStatus);
      
      const matchesYear = !this.searchYear || 
        book.publicationYear === this.searchYear;
      
      const matchesGenre = !this.searchGenre || 
        book.genre === this.searchGenre;
      
      return matchesTitle && matchesAuthor && matchesStatus && matchesYear && matchesGenre;
    });
  }

  private matchesStatusFilter(book: Book, status: string): boolean {
    switch (status) {
      case BookStatus.Available:
        return book.availableCopies > 2;
      case BookStatus.LowStock:
        return book.availableCopies > 0 && book.availableCopies <= 2;
      case BookStatus.OutOfStock:
        return book.availableCopies === 0;
      default:
        return true;
    }
  }

  clearFilters(): void {
    this.searchTitle = '';
    this.searchAuthor = '';
    this.searchStatus = '';
    this.searchYear = null;
    this.searchGenre = '';
    this.filteredBooks = this.books;
  }

  openCreateForm(): void {
    this.editedBook = this.getEmptyBook();
    this.editMode = false;
    this.sidebarVisible = true;
  }

  openEditSidebar(book: Book): void {
    this.selectedBook = book;
    this.editedBook = { ...book };
    this.editMode = true;
    this.sidebarVisible = true;
  }

  closeSidebar(): void {
    this.sidebarVisible = false;
    this.selectedBook = null;
    this.editedBook = this.getEmptyBook();
    this.editMode = false;
    this.isbnError = '';
  }

  saveBook(): void {
    // Validate ISBN before saving
    if (!this.validateISBN(this.editedBook.isbn)) {
      return; // Error message is already set in isbnError
    }

    if (this.editMode) {
      // Update existing book
      if (!this.editedBook.id) {
        return;
      }

      this.bookService.updateBook(this.editedBook.id, this.editedBook).subscribe({
        next: (updatedBook) => {
          const index = this.books.findIndex(b => b.id === updatedBook.id);
          if (index !== -1) {
            this.books[index] = updatedBook;
          }
          this.applyFilters();
          this.closeSidebar();
        },
        error: (error) => {
          console.error('Error updating book:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update book. Please try again.'
          });
        }
      });
    } else {
      // Create new book
      this.bookService.createBook(this.editedBook).subscribe({
        next: (newBook) => {
          this.books.push(newBook);
          this.applyFilters();
          this.closeSidebar();
        },
        error: (error) => {
          console.error('Error creating book:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to create book. Please try again.'
          });
        }
      });
    }
  }

  borrowBook(book: Book): void {
    this.selectedBookToBorrow = book;
    this.borrowingDays = 14;
    
    // For members, auto-select themselves
    if (this.isMember) {
      this.selectedMemberId = this.authService.currentUserValue?.id || null;
    } else {
      // For admins, show member selection
      this.selectedMemberId = null;
      this.loadMembers();
    }
    
    this.borrowDialogVisible = true;
  }

  loadMembers(): void {
    this.memberService.getAllMembers().subscribe({
      next: (data) => {
        // Filter only active members
        this.members = data.filter(m => m.isActive);
      },
      error: (error) => {
        console.error('Error loading members:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load members. Please try again.'
        });
      }
    });
  }

  confirmBorrowing(): void {
    if (!this.selectedBookToBorrow?.id) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Invalid book selected'
      });
      return;
    }
  
    // For members, check if their account is active
    if (this.isMember) {
      const currentUser = this.authService.currentUserValue;
      if (currentUser && currentUser.isActive === false) {
        this.messageService.add({
          severity: 'error',
          summary: 'Account Deactivated',
          detail: 'Your account has been deactivated. Please contact an administrator to reactivate your account.',
          life: 5000
        });
        return;
      }
    }
  
    const request: BorrowingRequest = {
      bookId: this.selectedBookToBorrow.id,
      borrowingDays: this.borrowingDays
    };
  
    // For members, send their user ID
    if (this.isMember) {
      request.userId = this.authService.currentUserValue?.id;
    } else {
      // For admins, send the selected member ID
      if (!this.selectedMemberId) {
        this.messageService.add({
          severity: 'warn',
          summary: 'Selection Required',
          detail: 'Please select a member'
        });
        return;
      }
      request.memberId = this.selectedMemberId;
    }
  
    this.borrowingService.borrowBook(request).subscribe({
      next: () => {
        this.loadBooks();
        this.borrowDialogVisible = false;
        this.messageService.add({
          severity: 'info',
          summary: 'Success',
          detail: `Book "${this.selectedBookToBorrow?.title}" borrowed successfully!`
        });
      },
      error: (error) => {
        console.error('Error borrowing book:', error);
        const errorMessage = error.error?.message || error.error || 'Failed to borrow book. Please try again.';
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: errorMessage
        });
      }
    });
  }

  closeBorrowDialog(): void {
    this.borrowDialogVisible = false;
    this.selectedBookToBorrow = null;
    this.selectedMemberId = null;
    this.borrowingDays = 14;
  }

  getReturnDate(): Date {
    const today = new Date();
    const returnDate = new Date(today);
    returnDate.setDate(today.getDate() + this.borrowingDays);
    return returnDate;
  }

  getMemberFullName(member: Member): string {
    return `${member.firstName} ${member.lastName}`;
  }

  getSelectedMemberName(): string {
    const member = this.members.find(m => m.id === this.selectedMemberId);
    return member ? this.getMemberFullName(member) : '';
  }

  confirmDelete(book: Book): void {
    if (!book.id) {
      return;
    }

    // Check if book has borrowings before showing confirmation
    this.borrowingService.getBorrowingsByBook(book.id).subscribe({
      next: (borrowings) => {
        // Filter to only count active borrowings from active members (not returned)
        const activeBorrowings = borrowings.filter(
          b => b.status !== BorrowingStatus.RETURNED && b.member?.isActive === true
        );
        
        if (activeBorrowings.length > 0) {
          // Book has active borrowings from active members - show error message
          this.messageService.add({
            severity: 'error',
            summary: 'Cannot Delete Book',
            detail: `Cannot delete "${book.title}" because it has ${activeBorrowings.length} active borrowing record(s) from active members. Please return all borrowed copies first.`,
            life: 5000
          });
        } else {
          // No borrowings - show confirmation dialog
          this.confirmationService.confirm({
            message: `Are you sure you want to delete "${book.title}"?`,
            header: 'Delete Confirmation',
            icon: 'pi pi-exclamation-triangle',
            acceptButtonStyleClass: 'p-button-danger',
            rejectButtonStyleClass: 'p-button-secondary',
            accept: () => {
              this.deleteBook(book.id!);
            }
          });
        }
      },
      error: (error) => {
        console.error('Error checking borrowings:', error);
        // If check fails, still show confirmation but handle error on delete
        this.confirmationService.confirm({
          message: `Are you sure you want to delete "${book.title}"?`,
          header: 'Delete Confirmation',
          icon: 'pi pi-exclamation-triangle',
          acceptButtonStyleClass: 'p-button-danger',
          rejectButtonStyleClass: 'p-button-secondary',
          accept: () => {
            this.deleteBook(book.id!);
          }
        });
      }
    });
  }

  deleteBook(bookId: number): void {
    // Get book info before deletion for error messages
    const bookToDelete = this.books.find(b => b.id === bookId);
    
    this.bookService.deleteBook(bookId).subscribe({
      next: () => {
        // Remove from local array
        this.books = this.books.filter(b => b.id !== bookId);
        this.applyFilters();
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `Book "${bookToDelete?.title}" deleted successfully!`
        });
      },
      error: (error) => {
        console.error('Error deleting book:', error);
        
        // Check if error is due to foreign key constraint
        const errorMessage = error.error?.message || error.message || '';
        const errorDetail = error.error?.detail || '';
        const fullError = `${errorMessage} ${errorDetail}`.toLowerCase();
        
        if (fullError.includes('foreign key') || fullError.includes('borrowings') || fullError.includes('constraint')) {
          this.messageService.add({
            severity: 'error',
            summary: 'Cannot Delete Book',
            detail: `Cannot delete "${bookToDelete?.title}" because it has borrowing records in the database. The backend needs to be updated to allow deletion of books with only returned borrowings.`,
            life: 7000
          });
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to delete book. Please try again.'
          });
        }
      }
    });
  }

  getAvailabilityStatus(book: Book): 'success' | 'warn' | 'danger' {
    if (book.availableCopies === 0) {
      return 'danger';
    } else if (book.availableCopies <= 2) {
      return 'warn';
    }
    return 'success';
  }

  getAvailabilityLabel(book: Book): string {
    if (book.availableCopies === 0) {
      return 'Out of Stock';
    } else if (book.availableCopies <= 2) {
      return 'Low Stock';
    }
    return 'Available';
  }

  private getEmptyBook(): Book {
    return {
      title: '',
      author: '',
      isbn: '',
      publicationYear: null,
      genre: '',
      description: '',
      totalCopies: 0,
      availableCopies: 0
    };
  }

  // Role-based permissions
  get isAdmin(): boolean {
    return this.authService.isAdmin;
  }

  get isMember(): boolean {
    return this.authService.isMember;
  }

  get canCreateBook(): boolean {
    return this.isAdmin;
  }

  get canEditBook(): boolean {
    return this.isAdmin;
  }

  get canDeleteBook(): boolean {
    return this.isAdmin;
  }

  get canBorrowBook(): boolean {
    return true; // Both admin and member can borrow
  }
}
