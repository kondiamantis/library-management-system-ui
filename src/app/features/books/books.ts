import { Component, OnInit } from '@angular/core';
import { BookService } from '../../core/services/book.service';
import { Book } from '../../core/models/book.model';
import { BookGenre } from '../../shared/enums/book-genre.enum';
import { BookStatus } from '../../shared/enums/book-status.enum';
import { ConfirmationService } from 'primeng/api';

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
  
  // Sidebar
  sidebarVisible: boolean = false;
  selectedBook: Book | null = null;
  editMode: boolean = false;
  
  // Edit form
  editedBook: Book = this.getEmptyBook();

  constructor(
    private bookService: BookService,
    private confirmationService: ConfirmationService
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
  }

  saveBook(): void {
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
          alert('Failed to update book. Please try again.');
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
          alert('Failed to create book. Please try again.');
        }
      });
    }
  }

  borrowBook(book: Book): void {
    // TODO: Implement borrow functionality
    console.log('Borrow book:', book);
    alert(`Borrowing functionality for "${book.title}" will be implemented soon!`);
  }

  confirmDelete(book: Book): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete "${book.title}"?`,
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-secondary',
      accept: () => {
        if (book.id) {
          this.deleteBook(book.id);
        }
      }
    });
  }

  deleteBook(bookId: number): void {
    this.bookService.deleteBook(bookId).subscribe({
      next: () => {
        // Remove from local array
        this.books = this.books.filter(b => b.id !== bookId);
        this.applyFilters();
      },
      error: (error) => {
        console.error('Error deleting book:', error);
        alert('Failed to delete book. Please try again.');
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
}
