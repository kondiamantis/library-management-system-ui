import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'selected-theme';
  
  constructor() {
    // Load saved theme on app start
    const savedTheme = localStorage.getItem(this.THEME_KEY);
    if (savedTheme === 'dark') {
      this.enableDarkMode();
    }
  }
  
  isDarkMode(): boolean {
    return document.documentElement.classList.contains('dark-mode');
  }
  
  toggleTheme(): void {
    if (this.isDarkMode()) {
      this.enableLightMode();
    } else {
      this.enableDarkMode();
    }
  }
  
  private enableDarkMode(): void {
    document.documentElement.classList.add('dark-mode');
    localStorage.setItem(this.THEME_KEY, 'dark');
  }
  
  private enableLightMode(): void {
    document.documentElement.classList.remove('dark-mode');
    localStorage.setItem(this.THEME_KEY, 'light');
  }
}

