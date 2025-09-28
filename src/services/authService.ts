import { apiClient } from './api';
import { setCookie, getCookie, removeCookie } from '../utils/cookies';

// Placeholder auth service to replace Firebase authentication
// This will be replaced with actual API calls when you provide the APIs

export interface AuthUser {
  uid: string;
  email?: string | null;
  phoneNumber?: string | null;
  displayName?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  role?: string | null;
  status?: string | null;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  data?: any;
  user?: AuthUser;
}

export interface ForgotPasswordResponse {
  success: boolean;
  message?: string;
  data?: {
    resetToken?: string;
  };
}

export interface VerifyOtpResponse {
  success: boolean;
  message?: string;
  data?: {
    verified?: boolean;
  };
}

export interface ResetPasswordResponse {
  success: boolean;
  message?: string;
}

export interface LoginResponse {
  success: boolean;
  message?: string;
  data?: {
    user?: AuthUser;
    token?: string;
  };
}

export interface RegistrationResponse {
  success: boolean;
  message?: string;
  data?: {
    user?: AuthUser;
    confirmationResult?: any;
    recaptchaContainerId?: string;
  };
}

class AuthService {
  // Placeholder for user state
  private currentUser: AuthUser | null = null;

  // Initialize auth service and restore user from storage
  async initialize(): Promise<AuthUser | null> {
    try {
      const token = getCookie('authToken');
      const userData = getCookie('userData');
      
      if (!token || !userData) {
        return null;
      }

      // Check if token is expiring soon and try to refresh it
      if (this.isTokenExpiringSoon()) {
        const refreshed = await this.refreshTokenIfNeeded();
        if (!refreshed) {
          // Token refresh failed, clear everything
          this.clearAuthData();
          return null;
        }
      }

      // Validate token with backend
      const isValid = await this.validateToken(token);
      
      if (isValid) {
        // Restore user data
        this.currentUser = JSON.parse(userData);
        return this.currentUser;
      } else {
        // Token is invalid, clear everything
        this.clearAuthData();
        return null;
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      this.clearAuthData();
      return null;
    }
  }

  // Validate token with backend
  private async validateToken(token: string): Promise<boolean> {
    try {
      // Set token in headers for validation
      const response = await apiClient.get('/vendor/validate-token', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      return response.data?.success === true;
    } catch (error: any) {
      // If it's a 401 error, the token is definitely invalid
      if (error.response?.status === 401) {
        return false;
      }
      
      // For other errors, we'll assume the token is valid to avoid unnecessary logouts
      // This is a fallback strategy - you might want to adjust this based on your needs
      console.warn('Token validation error (non-401):', error);
      return true;
    }
  }

  // Refresh token if needed
  private async refreshTokenIfNeeded(): Promise<boolean> {
    try {
      const token = getCookie('authToken');
      if (!token) return false;

      const response = await apiClient.post('/vendor/refresh-token', {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data?.success && response.data?.data?.newToken) {
        // Update stored token
        const userData = getCookie('userData');
        if (userData) {
          const user = JSON.parse(userData);
          this.storeAuthData(response.data.data.newToken, user);
        }
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Token refresh error:', error);
      return false;
    }
  }

  // Check if token is expired or about to expire
  private isTokenExpiringSoon(): boolean {
    // This is a simple check - you might want to implement JWT expiration checking
    // For now, we'll assume tokens are valid for 7 days and refresh if older than 6 days
    const token = getCookie('authToken');
    if (!token) return true;

    // You could decode the JWT token here to check actual expiration
    // For now, we'll use a simple approach
    return false;
  }

  // Store auth data in cookies
  private storeAuthData(token: string, user: AuthUser): void {
    setCookie('authToken', token, 7); // 7 days expiry
    setCookie('userData', JSON.stringify(user), 7);
  }

  // Clear all auth data
  private clearAuthData(): void {
    removeCookie('authToken');
    removeCookie('userData');
    this.currentUser = null;
  }

  // Login with email and password
  async loginWithEmail(email: string, password: string): Promise<LoginResponse> {
    try {
      const response = await apiClient.post('/vendor/login', {
        identifier: email,
        password: password
      });

      const data = response.data;

      if (data.success && data.data?.user) {
        // Create user object
        const user: AuthUser = {
          uid: data.data.user.id,
          email: data.data.user.email || email,
          phoneNumber: data.data.user.mobile,
          displayName: `${data.data.user.firstName} ${data.data.user.lastName}`.trim(),
          firstName: data.data.user.firstName,
          lastName: data.data.user.lastName,
          role: data.data.user.role,
          status: data.data.user.status
        };

        // Store auth data
        if (data.data.authToken) {
          this.storeAuthData(data.data.authToken, user);
        }

        // Set current user
        this.currentUser = user;

        return {
          success: true,
          data: {
            user: this.currentUser,
            token: data.data.authToken
          }
        };
      } else {
        throw new Error(data.message || 'Login failed');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Login failed'
      };
    }
  }

  // Login with phone number
  async loginWithPhone(phone: string): Promise<RegistrationResponse> {
    try {
      const response = await apiClient.post('/vendor/send-otp', {
        mobile: phone
      });

      const data = response.data;

      if (data.success) {
        return {
          success: true,
          data: {
            confirmationResult: { 
              confirm: async (code: string) => {
                // This will be handled by verifyPhoneOtp method
                return { user: { uid: 'temp-uid' } };
              },
              mobile: phone // Include mobile number for OTP verification
            },
            recaptchaContainerId: 'recaptcha-container'
          }
        };
      } else {
        throw new Error(data.message || 'Failed to send OTP');
      }
    } catch (error: any) {
      console.error('Send OTP error:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to send OTP'
      };
    }
  }

  // Register new user
  async registerUser(params: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone: string;
    pinCode?: string;
    city?: string;
    state?: string;
    address?: string;
    storeName?: string;
    storeAddress?: string;
    facebookUrl?: string;
    instagramUrl?: string;
    youtubeUrl?: string;
  }): Promise<RegistrationResponse> {
    try {
      const response = await apiClient.post('/vendor/register', {
        firstName: params.firstName,
        lastName: params.lastName,
        email: params.email,
        password: params.password,
        mobile: params.phone, // API expects 'mobile' instead of 'phone'
        pinCode: params.pinCode,
        city: params.city,
        state: params.state,
        address: params.address,
        storeName: params.storeName,
        storeAddress: params.storeAddress,
        facebookUrl: params.facebookUrl,
        instagramUrl: params.instagramUrl,
        youtubeUrl: params.youtubeUrl,
      });

      const data = response.data;

      // Don't set current user yet - wait for OTP verification
      // This prevents immediate authentication state change

      return {
        success: true,
        data: {
          user: {
            uid: data.user?.uid || 'temp-uid-' + Date.now(),
            email: params.email,
            displayName: `${params.firstName} ${params.lastName}`.trim(),
            firstName: params.firstName,
            lastName: params.lastName
          },
          confirmationResult: { 
            confirm: async (code: string) => ({ user: { uid: data.user?.uid || 'temp-uid-' + Date.now() } }),
            mobile: params.phone // Include mobile number for OTP verification
          },
          recaptchaContainerId: 'recaptcha-container'
        }
      };
    } catch (error: any) {
      console.error('Registration error:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Registration failed'
      };
    }
  }

  // Verify phone OTP
  async verifyPhoneOtp(confirmationResult: any, code: string): Promise<any> {
    try {
      // Extract mobile number from confirmationResult or use a stored value
      const mobile = confirmationResult?.mobile || this.currentUser?.phoneNumber;
      
      if (!mobile) {
        throw new Error('Mobile number not found for OTP verification');
      }

      const response = await apiClient.post('/vendor/verify-otp', {
        mobile: mobile,
        otp: code
      });

      const data = response.data;

      console.log(response)

      // If verification is successful, update the current user
      if (data.success || data.user) {
        // Create user object
        const user: AuthUser = {
          uid: data.data.user?.id || data.data.user?.uid || this.currentUser?.uid || 'temp-uid',
          email: data.data.user?.email || this.currentUser?.email,
          phoneNumber: mobile,
          displayName: data.data.user?.firstName && data.data.user?.lastName 
            ? `${data.data.user.firstName} ${data.data.user.lastName}`.trim()
            : this.currentUser?.displayName,
          firstName: data.data.user?.firstName || this.currentUser?.firstName,
          lastName: data.data.user?.lastName || this.currentUser?.lastName,
          role: data.data.user?.role || this.currentUser?.role,
          status: data.data.user?.status || this.currentUser?.status
        };

        // Store auth token if provided (for login flow)
        if (data.data.authToken) {
          this.storeAuthData(data.data.authToken, user);
        }

        this.currentUser = user;
      }

      return { user: this.currentUser };
    } catch (error: any) {
      console.error('OTP verification error:', error);
      throw new Error(error.response?.data?.message || error.message || 'OTP verification failed');
    }
  }

  // Forgot password
  async forgotPassword(email: string): Promise<ForgotPasswordResponse> {
    try {
      const response = await apiClient.post('/vendor/forgot-password/request', {
        email: email
      });

      const data = response.data;

      if (data.success) {
        return {
          success: true,
          data: {
            resetToken: data.resetToken || data.data?.resetToken
          }
        };
      } else {
        throw new Error(data.message || 'Failed to send reset email');
      }
    } catch (error: any) {
      console.error('Forgot password error:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to send reset email'
      };
    }
  }

  // Verify OTP for password reset
  async verifyOtp(params: { email: string; resetToken: string; otp: string }): Promise<VerifyOtpResponse> {
    try {
      const response = await apiClient.post('/vendor/forgot-password/verify', {
        email: params.email,
        resetToken: params.resetToken,
        otp: params.otp
      });

      const data = response.data;

      if (data.success) {
        return {
          success: true,
          data: {
            verified: true
          }
        };
      } else {
        throw new Error(data.message || 'OTP verification failed');
      }
    } catch (error: any) {
      console.error('Verify OTP error:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'OTP verification failed'
      };
    }
  }

  // Reset password
  async resetPassword(params: { email: string; newPassword: string; resetToken: string }): Promise<ResetPasswordResponse> {
    try {
      const response = await apiClient.post('/vendor/forgot-password/reset', {
        email: params.email,
        newPassword: params.newPassword,
        resetToken: params.resetToken
      });

      const data = response.data;

      if (data.success) {
        return {
          success: true,
          message: data.message || 'Password reset successful'
        };
      } else {
        throw new Error(data.message || 'Password reset failed');
      }
    } catch (error: any) {
      console.error('Reset password error:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Password reset failed'
      };
    }
  }

  // Resend OTP
  async resendOtp(email: string, resetToken: string): Promise<ForgotPasswordResponse> {
    try {
      const response = await apiClient.post('/vendor/forgot-password/resend', {
        email: email,
        resetToken: resetToken
      });

      const data = response.data;

      if (data.success) {
        return {
          success: true,
          data: {
            resetToken: data.resetToken || data.data?.resetToken
          }
        };
      } else {
        throw new Error(data.message || 'Failed to resend OTP');
      }
    } catch (error: any) {
      console.error('Resend OTP error:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to resend OTP'
      };
    }
  }

  // Logout
  async logout(): Promise<void> {
    try {
      // Clear auth data
      this.clearAuthData();
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  // Get current user
  getCurrentUser(): AuthUser | null {
    return this.currentUser;
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  // Get auth token from cookie
  getAuthToken(): string | null {
    return getCookie('authToken');
  }

  // Listen to auth state changes (placeholder)
  onAuthStateChanged(callback: (user: AuthUser | null) => void): () => void {
    // TODO: Replace with actual auth state listener
    console.log('Auth state listener registered');
    
    // Return unsubscribe function
    return () => {
      console.log('Auth state listener unregistered');
    };
  }

  // Start periodic token validation
  startTokenValidation(intervalMinutes: number = 30): () => void {
    const interval = setInterval(async () => {
      try {
        const token = getCookie('authToken');
        if (token) {
          const isValid = await this.validateToken(token);
          if (!isValid) {
            // Token is invalid, clear everything
            this.clearAuthData();
            // Redirect to login
            if (window.location.pathname !== '/login') {
              window.location.href = '/login';
            }
          }
        }
      } catch (error) {
        console.error('Periodic token validation error:', error);
      }
    }, intervalMinutes * 60 * 1000);

    // Return function to stop validation
    return () => clearInterval(interval);
  }

  // Stop periodic token validation
  stopTokenValidation(): void {
    // This will be handled by the cleanup function returned by startTokenValidation
  }
}

export const authService = new AuthService();
