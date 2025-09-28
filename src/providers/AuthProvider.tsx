import React, { useEffect, useRef } from "react";
import { useAppDispatch } from "../store";
import {
  setAuthLoading,
  setAuthStatus,
  setAuthUser,
  resetAuth,
} from "../store/slices/authSlice";
import { authService } from "../services/authService";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();
  const tokenValidationCleanup = useRef<(() => void) | null>(null);

  useEffect(() => {
    const initializeAuth = async () => {
      dispatch(setAuthLoading(true));

      try {
        // Initialize auth service and restore user from storage
        const user = await authService.initialize();

        if (!user) {
          // No valid user found, reset auth state
          dispatch(resetAuth());
          return;
        }

        // User is authenticated, set user data
        dispatch(
          setAuthUser({
            uid: user.uid,
            email: user.email,
            phoneNumber: user.phoneNumber,
            displayName: user.displayName,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            status: user.status,
          })
        );

        // Set auth status based on user status
        if (user.status === "APPROVED") {
          dispatch(setAuthStatus("approved"));
        } else if (user.status === "PENDING") {
          dispatch(setAuthStatus("pending"));
        } else if (user.status === "BLOCKED") {
          dispatch(setAuthStatus("blocked"));
        } else {
          dispatch(setAuthStatus("unauthenticated"));
        }

        // Start periodic token validation (every 30 minutes)
        tokenValidationCleanup.current = authService.startTokenValidation(30);
      } catch (error) {
        console.error("Auth initialization error:", error);
        // Clear everything on error
        await authService.logout();
        dispatch(resetAuth());
      } finally {
        dispatch(setAuthLoading(false));
      }
    };

    initializeAuth();

    // Cleanup function
    return () => {
      if (tokenValidationCleanup.current) {
        tokenValidationCleanup.current();
      }
    };
  }, []); // dispatch is stable and doesn't need to be in dependencies

  return <>{children}</>;
}
