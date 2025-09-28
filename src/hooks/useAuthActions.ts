import { useAppDispatch, useAppSelector } from "../store";
import { setAuthUser, setAuthStatus } from "../store/slices/authSlice";
import { getFriendlyAuthError } from "../lib/errorMessages";
import { authService } from "../services/authService";
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export function useAuthActions() { 
  const dispatch = useAppDispatch();

  const startEmailPhoneSignup = async (params: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone: string; // in E.164
    pinCode?: string;
    city?: string;
    state?: string;
    address?: string;
    storeName?: string;
    storeAddress?: string;
    facebookUrl?: string;
    instagramUrl?: string;
    youtubeUrl?: string;
  }) => {
    try {
      // Register user with auth service (this already calls the API)
      const authResponse = await authService.registerUser(params);
      
      if (!authResponse.success) {
        throw new Error(authResponse.message || "Registration failed");
      }

      // Don't set user as authenticated yet - wait for OTP verification
      // The user will be set in Redux store only after OTP verification
      // This prevents immediate redirect to dashboard

      // Return confirmation result for phone verification
      return { 
        confirmationResult: authResponse.data?.confirmationResult, 
        recaptchaContainerId: authResponse.data?.recaptchaContainerId 
      };
    } catch (e) {
      throw new Error(getFriendlyAuthError(e));
    }
  };

  const verifyPhoneOtp = async (confirmationResult: any, code: string) => {
    try {
      const result = await authService.verifyPhoneOtp(confirmationResult, code);
      
      console.log(result)
      // Update user data in Redux store after OTP verification
      if (result.user) {
        dispatch(setAuthUser({
          uid: result.user.uid,
          email: result.user.email,
          phoneNumber: result.user.phoneNumber,
          displayName: result.user.displayName,
          firstName: result.user.firstName,
          lastName: result.user.lastName,
          role: result.user.role,
          status: result.user.status,
        }));
        
        // Set status based on user status
        if (result.user.status === "APPROVED") {
          dispatch(setAuthStatus("approved"));
        } else if (result.user.status === "PENDING") {
          dispatch(setAuthStatus("pending"));
        } else if (result.user.status === "BLOCKED") {
          dispatch(setAuthStatus("blocked"));
        }
      }
      
      return result;
    } catch (e) {
      throw new Error(getFriendlyAuthError(e));
    }
  };

  const loginWithEmail = async (email: string, password: string) => {
    try {
      const response = await authService.loginWithEmail(email, password);
      if (!response.success) {
        throw new Error(response.message || "Login failed");
      }

      // Set user data in Redux store
      if (response.data?.user) {
        dispatch(setAuthUser({
          uid: response.data.user.uid,
          email: response.data.user.email,
          phoneNumber: response.data.user.phoneNumber,
          displayName: response.data.user.displayName,
          firstName: response.data.user.firstName,
          lastName: response.data.user.lastName,
          role: response.data.user.role,
          status: response.data.user.status,
        }));
        
        // Set status based on user status
        if (response.data.user.status === "APPROVED") {
          dispatch(setAuthStatus("approved"));
        } else if (response.data.user.status === "PENDING") {
          dispatch(setAuthStatus("pending"));
        } else if (response.data.user.status === "BLOCKED") {
          dispatch(setAuthStatus("blocked"));
        }
      }

      return response.data;
    } catch (e) {
      throw new Error(getFriendlyAuthError(e));
    }
  };

  const loginWithPhone = async (phone: string) => {
    try {
      const response = await authService.loginWithPhone(phone);
      if (!response.success) {
        throw new Error(response.message || "Phone login failed");
      }
      return { 
        confirmationResult: response.data?.confirmationResult, 
        recaptchaContainerId: response.data?.recaptchaContainerId 
      };
    } catch (e) {
      throw new Error(getFriendlyAuthError(e));
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      // Clear user data from Redux store
      dispatch(setAuthUser(null));
      dispatch(setAuthStatus("unauthenticated"));
    } catch (e) {
      console.error("Logout error:", e);
      // Still clear the store even if logout fails
      dispatch(setAuthUser(null));
      dispatch(setAuthStatus("unauthenticated"));
    }
  };

  return {
    startEmailPhoneSignup,
    verifyPhoneOtp,
    loginWithEmail,
    loginWithPhone,
    logout,
  };
}

export const useAuthStatus = () => {
  const { user, status, loading } = useAppSelector((s) => s.auth);
  const navigate = useNavigate();

  const logout = async () => {
    try {
      await authService.logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Force redirect even if logout fails
      navigate('/login');
    }
  };

  const checkAuthStatus = () => {
    if (!loading && user && status === 'approved') {
      return true;
    }
    return false;
  };

  return {
    user,
    status,
    loading,
    logout,
    checkAuthStatus,
    isAuthenticated: !!user && status === 'approved',
    isPending: !!user && status === 'pending',
    isBlocked: !!user && status === 'blocked',
  };
};

// Hook to prevent authenticated users from accessing public routes
export const usePreventAuthenticatedAccess = () => {
  const { user, loading } = useAppSelector((s) => s.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      // User is authenticated, redirect to dashboard
      navigate('/', { replace: true });
    }
  }, [user, loading, navigate]);

  return { user, loading };
};
