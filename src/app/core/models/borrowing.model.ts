import { BorrowingStatus } from '../../shared/enums/borrowing-status.enum';
import { Book } from './book.model';
import { Member } from './member.model';


export interface Borrowing {
  id?: number;
  book: Book;
  member: Member;
  borrowDate: string;
  dueDate: string;
  returnDate?: string;
  lateFee: number;
  status: BorrowingStatus;
}

