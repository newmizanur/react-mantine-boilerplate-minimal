export type UserRole = 'Admin' | 'Manager' | 'Viewer';
export type UserStatus = 'Active' | 'Invited' | 'Disabled';
export type UserId = string | number;

export type User = {
  id: UserId;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  created_at: string;
  updated_at: string;
};

export type UserInput = Omit<User, 'id' | 'created_at' | 'updated_at'> & {
  id?: UserId;
};
