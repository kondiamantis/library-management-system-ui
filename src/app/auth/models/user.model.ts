import { Role } from '../../shared/enums/role.enum';

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  isActive: boolean;
  createdAt?: string;
}

