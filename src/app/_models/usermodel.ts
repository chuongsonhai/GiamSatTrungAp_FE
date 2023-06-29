import { Role } from "./role";

export class UserModel {
  userId: number;
  username: string;
  fullName: string;
  email: string;
  maDViQLy: string;
  
  JwtToken: string;
  RefreshToken: string;
  Roles: Role[]; 
}