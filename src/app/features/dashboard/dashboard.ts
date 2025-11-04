import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../core/services/dashboard.service';
import { BorrowingService } from '../../core/services/borrowing.service';
import { DashboardStats } from '../../core/models/dashboard-stats.model';
import { Borrowing } from '../../core/models/borrowing.model';
import { BorrowingStatus } from '../../shared/enums/borrowing-status.enum';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class DashboardComponent implements OnInit {
  stats: DashboardStats | null = null;
  overdueBorrowings: Borrowing[] = [];
  loading = true;
  chartData: any;
  chartOptions: any;

  constructor(
    private dashboardService: DashboardService,
    private borrowingService: BorrowingService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
    this.initChart();
  }

  loadDashboardData(): void {
    this.loading = true;
    
    this.dashboardService.getDashboardStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.updateChart();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading dashboard stats:', error);
        this.loading = false;
      }
    });

    this.borrowingService.getOverdueBorrowings().subscribe({
      next: (data) => {
        this.overdueBorrowings = data.slice(0, 5); // Show only 5 recent
      },
      error: (error) => {
        console.error('Error loading overdue borrowings:', error);
      }
    });
  }

  initChart(): void {
    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            usePointStyle: true,
            padding: 20,
            font: {
              size: 14
            }
          }
        },
        tooltip: {
          callbacks: {
            label: (context: any) => {
              const label = context.label || '';
              const value = context.parsed || 0;
              const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
              const percentage = ((value / total) * 100).toFixed(1);
              return `${label}: ${value} (${percentage}%)`;
            }
          }
        }
      }
    };
  }

  updateChart(): void {
    if (!this.stats) return;

    this.chartData = {
      labels: ['Available Books', 'Borrowed Books'],
      datasets: [
        {
          data: [this.stats.availableBooks, this.stats.borrowedBooks],
          backgroundColor: ['#22C55E', '#F59E0B'],
          hoverBackgroundColor: ['#16A34A', '#D97706'],
          borderWidth: 0
        }
      ]
    };
  }

  getStatusSeverity(status: BorrowingStatus): "success" | "info" | "warn" | "danger" | "secondary" | "contrast" {
    switch (status) {
      case BorrowingStatus.BORROWED:
        return 'info';
      case BorrowingStatus.OVERDUE:
        return 'danger';
      case BorrowingStatus.RETURNED:
        return 'success';
      default:
        return 'info';
    }
  }

  refresh(): void {
    this.loadDashboardData();
  }
}