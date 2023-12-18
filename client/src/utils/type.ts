export interface UserProfile {
  [key: string]: string | Date | undefined;
  id: string;
  name: string;
  email: string;
  password?: string;
  birthdate: Date | string;
  gender: string;
  profilePhoto?: string;
}
