import { Component, OnInit } from '@angular/core';
import { MemberService, MemberStats } from '../../core/services/member.service';
import { BorrowingService } from '../../core/services/borrowing.service';
import { AuthService } from '../../auth/services/auth.service';
import { Member } from '../../core/models/member.model';
import { Borrowing } from '../../core/models/borrowing.model';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-members',
  standalone: false,
  templateUrl: './members.html',
  styleUrl: './members.scss',
})
export class MembersComponent implements OnInit {
  members: Member[] = [];
  filteredMembers: Member[] = [];
  currentMemberProfile: Member | null = null;
  memberStats: MemberStats | null = null;
  memberBorrowings: Borrowing[] = [];
  loading: boolean = false;

  // Admin view
  selectedMember: Member | null = null;
  editDialogVisible: boolean = false;
  detailsDrawerVisible: boolean = false;
  
  // Filters
  searchQuery: string = '';
  statusFilter: string = '';

  statusOptions = [
    { label: 'All Status', value: '' },
    { label: 'Active', value: 'true' },
    { label: 'Inactive', value: 'false' }
  ];

  // Edit mode
  isEditMode: boolean = false;
  editingMember: Member | null = null;

  constructor(
    private memberService: MemberService,
    private borrowingService: BorrowingService,
    public authService: AuthService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    if (this.isAdmin) {
      this.loadAllMembers();
    } else {
      this.loadMemberProfile();
    }
  }

  // Admin Methods
  loadAllMembers(): void {
    this.loading = true;
    this.memberService.getAllMembers().subscribe({
      next: (data) => {
        this.members = data;
        this.applyFilters();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading members:', error);
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    this.filteredMembers = this.members.filter(member => {
      const matchesSearch = !this.searchQuery || 
        member.firstName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        member.lastName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        member.email.toLowerCase().includes(this.searchQuery.toLowerCase());
      
      const matchesStatus = !this.statusFilter || 
        member.isActive.toString() === this.statusFilter;

      return matchesSearch && matchesStatus;
    });
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.statusFilter = '';
    this.applyFilters();
  }

  viewMemberDetails(member: Member): void {
    this.selectedMember = member;
    this.loadMemberDetailsAndStats(member.id!);
    this.detailsDrawerVisible = true;
  }

  loadMemberDetailsAndStats(memberId: number): void {
    // Load stats
    this.memberService.getMemberStats(memberId).subscribe({
      next: (stats) => {
        this.memberStats = stats;
      },
      error: (error) => {
        console.error('Error loading member stats:', error);
      }
    });

    // Load borrowings
    this.borrowingService.getBorrowingsByMember(memberId).subscribe({
      next: (borrowings) => {
        this.memberBorrowings = borrowings;
      },
      error: (error) => {
        console.error('Error loading member borrowings:', error);
      }
    });
  }

  openEditDialog(member: Member): void {
    this.isEditMode = true;
    this.editingMember = { ...member };
    this.editDialogVisible = true;
  }

  closeEditDialog(): void {
    this.editDialogVisible = false;
    this.editingMember = null;
    this.isEditMode = false;
  }

  saveMember(): void {
    if (!this.editingMember || !this.editingMember.id) {
      return;
    }

    this.memberService.updateMember(this.editingMember.id, this.editingMember).subscribe({
      next: () => {
        this.loadAllMembers();
        this.closeEditDialog();
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Member updated successfully!'
        });
      },
      error: (error) => {
        console.error('Error updating member:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to update member. Please try again.'
        });
      }
    });
  }

  toggleMemberStatus(member: Member, event: Event): void {
    event.stopPropagation();
    
    this.confirmationService.confirm({
      message: `Are you sure you want to ${member.isActive ? 'deactivate' : 'activate'} ${member.firstName} ${member.lastName}?`,
      header: 'Confirm Action',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.memberService.toggleMemberStatus(member.id!).subscribe({
          next: () => {
            this.loadAllMembers();
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: `Member ${member.isActive ? 'deactivated' : 'activated'} successfully!`
            });
          },
          error: (error) => {
            console.error('Error toggling member status:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to update member status. Please try again.'
            });
          }
        });
      }
    });
  }

  // Member Methods
  loadMemberProfile(): void {
    this.loading = true;
    const userId = this.authService.currentUserValue?.id;
    
    if (!userId) {
      this.loading = false;
      return;
    }

    this.memberService.getMemberByUserId(userId).subscribe({
      next: (member) => {
        this.currentMemberProfile = member;
        this.loadMemberDetailsAndStats(member.id!);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading member profile:', error);
        this.loading = false;
      }
    });
  }

  openEditProfile(): void {
    if (this.currentMemberProfile) {
      this.isEditMode = false;
      this.editingMember = { ...this.currentMemberProfile };
      this.editDialogVisible = true;
    }
  }

  saveProfile(): void {
    if (!this.editingMember || !this.editingMember.id) {
      return;
    }

    this.memberService.updateMember(this.editingMember.id, this.editingMember).subscribe({
      next: () => {
        this.loadMemberProfile();
        this.closeEditDialog();
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Profile updated successfully!'
        });
      },
      error: (error) => {
        console.error('Error updating profile:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to update profile. Please try again.'
        });
      }
    });
  }

  // Helper Methods
  getMemberFullName(member: Member): string {
    return `${member.firstName} ${member.lastName}`;
  }

  getCurrentBorrowedCount(memberId: number): number {
    return this.members.find(m => m.id === memberId) ? 0 : 0; // Will be calculated from stats
  }

  isExpiringSoon(expiryDate: string): boolean {
    const expiry = new Date(expiryDate);
    const today = new Date();
    const daysUntilExpiry = Math.floor((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry > 0 && daysUntilExpiry <= 30;
  }

  isExpired(expiryDate: string): boolean {
    return new Date(expiryDate) < new Date();
  }

  getMembershipStatusSeverity(member: Member): 'success' | 'warn' | 'danger' {
    if (!member.membershipExpiryDate) return 'success';
    if (this.isExpired(member.membershipExpiryDate)) return 'danger';
    if (this.isExpiringSoon(member.membershipExpiryDate)) return 'warn';
    return 'success';
  }

  getMembershipStatusLabel(member: Member): string {
    if (!member.membershipExpiryDate) return 'Active';
    if (this.isExpired(member.membershipExpiryDate)) return 'Expired';
    if (this.isExpiringSoon(member.membershipExpiryDate)) return 'Expiring Soon';
    return 'Active';
  }

  // Role checks
  get isAdmin(): boolean {
    return this.authService.isAdmin;
  }

  get isMember(): boolean {
    return this.authService.isMember;
  }
}
