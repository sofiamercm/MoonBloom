export interface User {
  _id?: string;
  name: string;
  email: string;
  password?: string;
  createdAt?: string;
  profileImageUrl?: string;
  profileImagePublicId?: string;
}
