export interface Member {
    id?: number;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    address?: string;
    membershipDate: string;
    membershipExpiryDate?: string;
    isActive: boolean;
  }