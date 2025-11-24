import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Borrowing } from '../models/borrowing.model';
import { BorrowingRequest } from '../models/borrowing-request.model';


@Injectable({
  providedIn: 'root'
})
export class BorrowingService {
  private apiUrl = 'http://localhost:8080/api/borrowings';

  constructor(private http: HttpClient) {}

  getAllBorrowings(): Observable<Borrowing[]> {
    return this.http.get<Borrowing[]>(this.apiUrl);
  }

  getBorrowingById(id: number): Observable<Borrowing> {
    return this.http.get<Borrowing>(`${this.apiUrl}/${id}`);
  }

  borrowBook(request: BorrowingRequest): Observable<Borrowing> {
    return this.http.post<Borrowing>(this.apiUrl, request);
  }

  returnBook(id: number): Observable<Borrowing> {
    return this.http.put<Borrowing>(`${this.apiUrl}/${id}/return`, {});
  }

  getBorrowingsByMember(memberId: number): Observable<Borrowing[]> {
    return this.http.get<Borrowing[]>(`${this.apiUrl}/member/${memberId}`);
  }

  getBorrowingsByUser(userId: number): Observable<Borrowing[]> {
    return this.http.get<Borrowing[]>(`${this.apiUrl}/user/${userId}`);
  }

  getOverdueBorrowings(): Observable<Borrowing[]> {
    return this.http.get<Borrowing[]>(`${this.apiUrl}/overdue`);
  }

  getBorrowingsByStatus(status: string): Observable<Borrowing[]> {
    return this.http.get<Borrowing[]>(`${this.apiUrl}/status/${status}`);
  }
}