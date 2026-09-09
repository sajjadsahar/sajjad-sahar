export interface User {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  createdAt: string;
}

export interface UserDTO {
  id: string;
  username: string;
  email: string;
  role: 'admin';
}
