import { UserProfile, AuthSession } from "@/types/user";
import { MOCK_USER } from "@/data/mock-data";

export class AuthService {
  private sessionKey = "tapgo_session_v1";

  getStoredSession(): AuthSession | null {
    if (typeof window === "undefined") return null;
    try {
      const data = localStorage.getItem(this.sessionKey);
      if (!data) return null;
      return JSON.parse(data);
    } catch {
      return null;
    }
  }

  saveSession(session: AuthSession): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(this.sessionKey, JSON.stringify(session));
  }

  clearSession(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(this.sessionKey);
  }

  async loginWithPhone(phone: string, pinOrPass: string): Promise<AuthSession> {
    await new Promise((res) => setTimeout(res, 800));

    // Simulated login check
    const session: AuthSession = {
      user: {
        ...MOCK_USER,
        phone: phone.startsWith("+250") ? phone : `+250 ${phone.replace(/^0/, "")}`,
      },
      token: `tg_token_${Date.now()}`,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      isDemoMode: true,
    };

    this.saveSession(session);
    return session;
  }

  async verifyOtp(phone: string, otp: string): Promise<boolean> {
    await new Promise((res) => setTimeout(res, 700));
    // Accepts any 6 digit code for demo testing or "123456"
    return otp.length === 6;
  }

  async registerUser(name: string, phone: string, email: string): Promise<AuthSession> {
    await new Promise((res) => setTimeout(res, 900));

    const newUser: UserProfile = {
      id: `usr_${Date.now()}`,
      name,
      phone,
      email,
      status: "active",
      biometricsEnabled: false,
      pinSet: true,
      preferredLanguage: "en",
      theme: "light",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const session: AuthSession = {
      user: newUser,
      token: `tg_token_${Date.now()}`,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      isDemoMode: true,
    };

    this.saveSession(session);
    return session;
  }
}

export const authService = new AuthService();
