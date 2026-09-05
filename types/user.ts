export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  nationalId?: string;
  avatarUrl?: string;
  status: 'active' | 'pending_verification' | 'suspended';
  biometricsEnabled: boolean;
  pinSet: boolean;
  preferredLanguage: 'en' | 'rw' | 'fr';
  theme: 'light' | 'dark' | 'system';
  createdAt: string;
  updatedAt: string;
}

export interface AuthSession {
  user: UserProfile;
  token: string;
  expiresAt: string;
  isDemoMode: boolean;
}
