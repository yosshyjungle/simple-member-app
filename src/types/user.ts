export interface User {
  id: number;
  nickname: string;
  email: string;
  password_hash: string;
  created_at: Date;
  updated_at: Date;
}

export interface UserRegistrationData {
  nickname: string;
  email: string;
  password: string;
}

export interface UserLoginData {
  email: string;
  password: string;
}

export interface AuthUser {
  id: number;
  nickname: string;
  email: string;
}
