import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { MenuItem } from 'primeng/api';
<<<<<<< HEAD
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { AuthService } from '../../auth/services/auth.service';
import { ThemeService } from '../../core/services/theme.service';
import { MemberService } from '../../core/services/member.service';
import { User } from '../../auth/models/user.model';
import { Member } from '../../core/models/member.model';
import { Role } from '../../shared/enums/role.enum';
import { MessageService } from 'primeng/api';
=======
import { filter } from 'rxjs/operators';
import { AuthService } from '../../auth/services/auth.service';
import { ThemeService } from '../../core/services/theme.service';
import { User } from '../../auth/models/user.model';
>>>>>>> features/authentication

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar implements OnInit, OnDestroy {
  items: MenuItem[] = [];
  currentUser: User | null = null;
<<<<<<< HEAD
    userMenuItems: MenuItem[] = [];
  private destroy$ = new Subject<void>();

  // Profile dialog
  profileDialogVisible: boolean = false;
  editingProfile: Member | null = null;
  loadingProfile: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private themeService: ThemeService,
    private memberService: MemberService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        this.currentUser = user;
        this.updateMenuItems();
        this.updateUserMenu();
      });

    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.updateMenuItems();
      });

    this.updateMenuItems();
    this.updateUserMenu();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  updateMenuItems(): void {
    const currentUrl = this.router.url;
    const isAdmin = this.currentUser?.role === Role.ADMIN;

=======

  constructor(
    private router: Router,
    private authService: AuthService,
    private themeService: ThemeService
  ) {}

  ngOnInit(): void {
    // Subscribe to current user
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.buildMenu();
    });

    // Set active item on init and on route changes
    this.setActiveItem(this.router.url);
    
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.setActiveItem(event.url);
      });
  }

  private buildMenu(): void {
>>>>>>> features/authentication
    this.items = [
      {
        label: 'Home',
        icon: 'pi pi-home',
        routerLink: '/dashboard',
        styleClass: currentUrl.includes('/dashboard') ? 'active-menu-item' : ''
      },
      {
        label: 'Books',
        icon: 'pi pi-book',
        routerLink: '/books',
        styleClass: currentUrl.includes('/books') ? 'active-menu-item' : ''
      },
      {
<<<<<<< HEAD
        label: 'Members',
        icon: 'pi pi-users',
        routerLink: '/members',
        visible: isAdmin,
        styleClass: currentUrl.includes('/members') ? 'active-menu-item' : ''
      },
      {
        label: 'Borrowings',
        icon: 'pi pi-book',
        routerLink: '/borrowings',
        styleClass: currentUrl.includes('/borrowings') ? 'active-menu-item' : ''
      }
    ];
=======
        label: 'Borrowings',
        icon: 'pi pi-calendar',
        routerLink: '/borrowings'
      }
    ];

    // Add Members menu only for admin
    if (this.authService.isAdmin()) {
      this.items.push({
        label: 'Members',
        icon: 'pi pi-users',
        routerLink: '/members'
      });
    }
>>>>>>> features/authentication
  }

  updateUserMenu(): void {
    this.userMenuItems = [
      {
        label: 'My Profile',
        icon: 'pi pi-user',
        command: () => this.openProfileDialog()
      },
      {
        separator: true
      },
      {
        label: 'Logout',
        icon: 'pi pi-sign-out',
        iconStyle: {
          color: 'red'
        },
        
        command: () => this.logout(),
        styleClass: 'logout-menu-item'
      }
    ];
  }

  openProfileDialog(): void {
    const userId = this.authService.currentUserValue?.id;
    if (!userId) return;

    this.loadingProfile = true;
    this.memberService.getMemberByUserId(userId).subscribe({
      next: (member) => {
        this.editingProfile = { ...member };
        this.profileDialogVisible = true;
        this.loadingProfile = false;
      },
      error: (error) => {
        console.error('Error loading profile:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load profile. Please try again.'
        });
        this.loadingProfile = false;
      }
    });
  }

<<<<<<< HEAD
  closeProfileDialog(): void {
    this.profileDialogVisible = false;
    this.editingProfile = null;
  }

  saveProfile(): void {
    if (!this.editingProfile || !this.editingProfile.id) {
      return;
    }

    this.memberService.updateMember(this.editingProfile.id, this.editingProfile).subscribe({
      next: () => {
        this.closeProfileDialog();
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

=======
>>>>>>> features/authentication
  getUserFullName(): string {
    return this.authService.getUserFullName();
  }

  logout(): void {
    this.authService.logout();
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  isDarkMode(): boolean {
    return this.themeService.isDarkMode();
  }
<<<<<<< HEAD

  isLoggedIn(): boolean {
    return !!this.currentUser;
  }
=======
>>>>>>> features/authentication
}
