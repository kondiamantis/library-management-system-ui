import { Role } from '../../shared/enums/role.enum';

export interface AuthResponse {
  token: string;
  type: string;
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
}

