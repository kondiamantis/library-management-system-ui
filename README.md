# Library Management System

A modern library management system built with Angular and Spring Boot for managing books, members, and borrowings.

## Features

- **Authentication**: User login and signup with role-based access
- **Books Management**: Browse, search, and filter books (Admin can create, edit, delete)
- **Members Management**: View members and manage profiles (Admin can activate/deactivate members)
- **Borrowings Management**: Track book borrowings and returns
- **Dashboard**: View library statistics and overview

## Prerequisites

- Node.js (v18 or higher)
- npm (comes with Node.js)
- Backend API running on `http://localhost:8080`

## Setup

1. **Install dependencies** (this installs Angular and all required packages)
   ```bash
   npm install
   ```

2. **Ensure backend is running**
   - Make sure the Spring Boot backend API is running on `http://localhost:8080`

## Running the Application

1. **Start the development server**
   ```bash
   npm start
   ```

   **Note**: If you prefer to use Angular CLI commands directly, you can install it globally:
   ```bash
   npm install -g @angular/cli
   ```
   Then use `ng serve` instead of `npm start`.

2. **Open your browser**
   - Navigate to `http://localhost:4200`
   - The application will automatically reload when you make changes

## User Roles

- **Member**: Default role for new signups. Can browse books, borrow books, and view their own profile and borrowings.
- **Admin**: Full system access. Can manage books, members, and all borrowings. Admin accounts must be created through the backend/database.

## Getting Started

### Default Users

When the backend runs for the first time, it automatically creates 2 default users:

1. **Member User**: Default member account for testing
2. **Admin User**: Default admin account with full system access

**Note**: Check the backend documentation or code for the default credentials.

### Using the Application

1. **Login with default account**: Navigate to `/login` and use one of the default accounts
2. **Or create a new account**: Navigate to `/signup` and register (creates a Member account by default)
3. **Explore**: Browse books, view your profile, and manage borrowings

**Note**: Admin accounts cannot be created through the frontend signup. Use the default admin account or create admin accounts through the backend API or database.

## Build for Production

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.
