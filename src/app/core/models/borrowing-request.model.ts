export interface BorrowingRequest {
    bookId: number;
    memberId?: number;
    userId?: number;
    borrowingDays?: number;
  }