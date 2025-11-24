import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Member } from '../models/member.model';

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  private apiUrl = 'http://localhost:8080/api/members';

  constructor(private http: HttpClient) {}

  getAllMembers(): Observable<Member[]> {
    return this.http.get<Member[]>(this.apiUrl);
  }

  getMemberById(id: number): Observable<Member> {
    return this.http.get<Member>(`${this.apiUrl}/${id}`);
  }

  createMember(member: Member): Observable<Member> {
    return this.http.post<Member>(this.apiUrl, member);
  }

  updateMember(id: number, member: Member): Observable<Member> {
    return this.http.put<Member>(`${this.apiUrl}/${id}`, member);
  }

  deleteMember(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  searchMembers(query: string): Observable<Member[]> {
    return this.http.get<Member[]>(`${this.apiUrl}/search?query=${query}`);
  }

  getMembersByStatus(status: string): Observable<Member[]> {
    return this.http.get<Member[]>(`${this.apiUrl}/status/${status}`);
  }

  getMemberByUserId(userId: number): Observable<Member> {
    return this.http.get<Member>(`${this.apiUrl}/user/${userId}`);
  }

  getMemberStats(memberId: number): Observable<MemberStats> {
    return this.http.get<MemberStats>(`${this.apiUrl}/${memberId}/stats`);
  }

  toggleMemberStatus(id: number): Observable<Member> {
    return this.http.put<Member>(`${this.apiUrl}/${id}/toggle-status`, {});
  }
}

export interface MemberStats {
  totalBooksBorrowed: number;
  currentlyBorrowed: number;
  booksReturned: number;
  overdueBooks: number;
}