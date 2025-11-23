import { Component, OnInit } from '@angular/core';
import { BookService } from '../../core/services/book.service';
import { Book } from '../../core/models/book.model';

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
  searchIsbn: string = '';
  searchYear: number | null = null;
  searchGenre: string = '';
  
  // Genre options for dropdown
  genreOptions = [
    { label: 'All Genres', value: '' },
    { label: 'Fiction', value: 'Fiction' },
    { label: 'Non-Fiction', value: 'Non-Fiction' },
    { label: 'Science', value: 'Science' },
    { label: 'Technology', value: 'Technology' },
    { label: 'History', value: 'History' },
    { label: 'Biography', value: 'Biography' },
    { label: 'Fantasy', value: 'Fantasy' },
    { label: 'Mystery', value: 'Mystery' },
    { label: 'Romance', value: 'Romance' },
    { label: 'Thriller', value: 'Thriller' },
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

  constructor(private bookService: BookService) {}

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
      
      const matchesIsbn = !this.searchIsbn || 
        book.isbn.toLowerCase().includes(this.searchIsbn.toLowerCase());
      
      const matchesYear = !this.searchYear || 
        book.publicationYear === this.searchYear;
      
      const matchesGenre = !this.searchGenre || 
        book.genre === this.searchGenre;
      
      return matchesTitle && matchesAuthor && matchesIsbn && matchesYear && matchesGenre;
    });
  }

  clearFilters(): void {
    this.searchTitle = '';
    this.searchAuthor = '';
    this.searchIsbn = '';
    this.searchYear = null;
    this.searchGenre = '';
    this.filteredBooks = this.books;
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
      }
    });
  }

  borrowBook(book: Book): void {
    // TODO: Implement borrow functionality
    console.log('Borrow book:', book);
    alert(`Borrowing functionality for "${book.title}" will be implemented soon!`);
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
