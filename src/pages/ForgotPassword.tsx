import React, { useState } from "react";
import { Mail, Shield, Lock, KeyRound, Eye, EyeOff } from "lucide-react";
import { getFriendlyAuthError } from "../lib/errorMessages";
import { authService } from "../services/authService";
import { usePreventAuthenticatedAccess } from "../hooks/useAuthActions";

type Step = 'request' | 'verify' | 'reset' | 'success';

export default function ForgotPassword() {
  const { user, loading: authLoading } = usePreventAuthenticatedAccess();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [currentStep, setCurrentStep] = useState<Step>('request');
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Show loading while checking auth status
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent mx-auto" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is already authenticated, this will redirect them
  if (user) {
    return null;
  }

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setIsLoading(true);
    
    try {
      const response = await authService.forgotPassword(email);
      if (response.success && response.data?.resetToken) {
        setResetToken(response.data.resetToken);
        setCurrentStep('verify');
      } else {
        setErrorMsg(response.message || 'Failed to send reset email');
      }
    } catch (error: any) {
      setErrorMsg(getFriendlyAuthError(error));
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setIsLoading(true);
    
    try {
      const response = await authService.verifyOtp({
        email,
        resetToken,
        otp
      });
      
      if (response.success && response.data?.verified) {
        setCurrentStep('reset');
      } else {
        setErrorMsg(response.message || 'Invalid OTP');
      }
    } catch (error: any) {
      setErrorMsg(getFriendlyAuthError(error));
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    
    if (newPassword !== confirmPassword) {
      setErrorMsg("Passwords don't match");
      return;
    }
    
    if (newPassword.length < 8) {
      setErrorMsg("Password must be at least 8 characters long");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await authService.resetPassword({
        email,
        newPassword,
        resetToken
      });
      
      if (response.success) {
        setCurrentStep('success');
      } else {
        setErrorMsg(response.message || 'Failed to reset password');
      }
    } catch (error: any) {
      setErrorMsg(getFriendlyAuthError(error));
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setErrorMsg("");
    setIsLoading(true);
    
    try {
      const response = await authService.resendOtp({
        email,
        resetToken
      });
      
      if (response.success) {
        setErrorMsg("OTP resent successfully!");
        setTimeout(() => setErrorMsg(""), 3000);
      } else {
        setErrorMsg(response.message || 'Failed to resend OTP');
      }
    } catch (error: any) {
      setErrorMsg(getFriendlyAuthError(error));
    } finally {
      setIsLoading(false);
    }
  };

  const renderRequestStep = () => (
    <form className="space-y-6" onSubmit={handleRequestReset}>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email address
        </label>
        <div className="relative">
          <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-9 pr-3 py-3 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="you@email.com"
            autoComplete="email"
            inputMode="email"
            disabled={isLoading}
          />
        </div>
      </div>
      {errorMsg && (
        <div className="text-sm text-red-600">{errorMsg}</div>
      )}
      <button 
        type="submit"
        disabled={isLoading}
        className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors"
      >
        {isLoading ? 'Sending...' : 'Send reset link'}
      </button>
    </form>
  );

  const renderVerifyStep = () => (
    <form className="space-y-6" onSubmit={handleVerifyOtp}>
      <div className="text-center mb-4">
        <p className="text-sm text-gray-600">
          We've sent a 6-digit OTP to <span className="font-semibold">{email}</span>
        </p>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Enter OTP
        </label>
        <div className="relative">
          <KeyRound className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            required
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
            className="w-full pl-9 pr-3 py-3 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-lg tracking-widest"
            placeholder="000000"
            maxLength={6}
            disabled={isLoading}
          />
        </div>
      </div>
      {errorMsg && (
        <div className={`text-sm ${errorMsg.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>
          {errorMsg}
        </div>
      )}
      <button 
        type="submit"
        disabled={isLoading || otp.length !== 6}
        className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors"
      >
        {isLoading ? 'Verifying...' : 'Verify OTP'}
      </button>
      <button
        type="button"
        onClick={handleResendOtp}
        disabled={isLoading}
        className="w-full py-2 px-4 text-blue-600 hover:text-blue-700 disabled:text-blue-400 text-sm"
      >
        Resend OTP
      </button>
    </form>
  );

  const renderResetStep = () => (
    <form className="space-y-6" onSubmit={handleResetPassword}>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          New Password
        </label>
        <div className="relative">
          <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type={showPassword ? "text" : "password"}
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full pl-9 pr-10 py-3 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter new password"
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Confirm New Password
        </label>
        <div className="relative">
          <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type={showConfirmPassword ? "text" : "password"}
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full pl-9 pr-10 py-3 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Confirm new password"
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>
      {errorMsg && (
        <div className="text-sm text-red-600">{errorMsg}</div>
      )}
      <button 
        type="submit"
        disabled={isLoading || !newPassword || !confirmPassword}
        className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors"
      >
        {isLoading ? 'Resetting...' : 'Reset Password'}
      </button>
    </form>
  );

  const renderSuccessStep = () => (
    <div className="text-center space-y-6">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
        <Shield className="w-8 h-8 text-green-600" />
      </div>
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Password Reset Successful!
        </h3>
        <p className="text-gray-600">
          Your password has been successfully reset. You can now log in with your new password.
        </p>
      </div>
      <a
        href="/login"
        className="inline-block w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
      >
        Back to Login
      </a>
    </div>
  );

  const getStepTitle = () => {
    switch (currentStep) {
      case 'request': return 'Reset your password';
      case 'verify': return 'Verify OTP';
      case 'reset': return 'Set new password';
      case 'success': return 'Password reset successful';
      default: return 'Reset your password';
    }
  };

  const getStepDescription = () => {
    switch (currentStep) {
      case 'request': return 'Enter your email and we will send a secure reset link.';
      case 'verify': return 'Enter the 6-digit OTP sent to your email.';
      case 'reset': return 'Create a new secure password for your account.';
      case 'success': return 'Your password has been successfully reset.';
      default: return 'Enter your email and we will send a secure reset link.';
    }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      <div className="hidden md:flex items-center justify-center bg-gradient-to-br from-[#7C3AED] via-[#6366F1] to-[#06B6D4] text-white p-12">
        <div className="max-w-md space-y-4">
          <div className="flex items-center gap-2 text-sm opacity-90">
            <Shield className="w-4 h-4" /> Secure password reset
          </div>
          <h2 className="text-4xl font-extrabold">Forgot Password</h2>
          <p className="opacity-90">
            {getStepDescription()}
          </p>
        </div>
      </div>
      <div className="flex items-center justify-center bg-gray-50 p-6">
        <div className="w-full max-w-xl p-8 bg-white rounded-2xl shadow-xl border border-gray-100">
          <div className="flex flex-col items-center mb-6">
            <h2 className="text-3xl font-extrabold text-gray-900">
              {getStepTitle()}
            </h2>
          </div>
          
          {currentStep === 'request' && renderRequestStep()}
          {currentStep === 'verify' && renderVerifyStep()}
          {currentStep === 'reset' && renderResetStep()}
          {currentStep === 'success' && renderSuccessStep()}
          
          {currentStep !== 'success' && currentStep !== 'request' && (
            <div className="text-center text-sm text-gray-600 mt-6">
              <button
                onClick={() => setCurrentStep('request')}
                className="text-blue-600 hover:text-blue-700"
              >
                Back to email input
              </button>
            </div>
          )}
          
          {currentStep === 'request' && (
            <div className="text-center text-sm text-gray-600 mt-6">
              Remember your password?{" "}
              <a href="/login" className="text-blue-600 hover:text-blue-700">
                Back to login
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
