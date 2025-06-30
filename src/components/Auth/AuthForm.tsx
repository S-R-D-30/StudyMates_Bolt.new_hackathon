import React, { useState, useEffect } from 'react';
import { User, BookOpen, Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles, GraduationCap, Users, Brain, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface AuthFormProps {
  onAuth: (user: { name: string; email: string }) => void;
  onSkipSignIn?: () => void;
}

export default function AuthForm({ onAuth, onSkipSignIn }: AuthFormProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showCodeVerification, setShowCodeVerification] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [forgotPasswordData, setForgotPasswordData] = useState({
    email: '',
    newPassword: '',
    confirmNewPassword: ''
  });

  // States for validation errors
  const [nameError, setNameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const resetFormAndErrors = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
    setForgotPasswordData({
      email: '',
      newPassword: '',
      confirmNewPassword: ''
    });
    setNameError(null);
    setEmailError(null);
    setPasswordError(null);
    setConfirmPasswordError(null);
    setGeneralError(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear specific errors when input changes
    if (name === 'name') setNameError(null);
    if (name === 'email') setEmailError(null);
    if (name === 'password') setPasswordError(null);
    if (name === 'confirmPassword') setConfirmPasswordError(null);
    setGeneralError(null);
  };

  const handleForgotPasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForgotPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
    setGeneralError(null);
  };

  const validateForm = () => {
    let isValid = true;

    // Reset all errors first
    setNameError(null);
    setEmailError(null);
    setPasswordError(null);
    setConfirmPasswordError(null);
    setGeneralError(null);

    // Name validation (Sign Up only)
    if (!isLogin && formData.name.trim().length < 3) {
      setNameError('Full name must be at least 3 characters.');
      isValid = false;
    }

    // Email validation
    if (!formData.email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
      setEmailError('Please enter a valid email address.');
      isValid = false;
    }

    // Password validation
    if (formData.password.length < 8) {
      setPasswordError('Password must be at least 8 characters long.');
      isValid = false;
    } else if (!/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/.test(formData.password)) {
        setPasswordError('Password requires a digit, lowercase, and uppercase letter.');
        isValid = false;
    }

    // Confirm Password validation (Sign Up only)
    if (!isLogin && formData.password !== formData.confirmPassword) {
      setConfirmPasswordError('Passwords do not match.');
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      setGeneralError('Please correct the errors in the form.');
      return;
    }

    setIsLoading(true);

    try {
      if (isLogin) {
        // Sign in with Supabase
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (error) {
          throw error;
        }

        if (data.user) {
          // Fetch user profile data
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('name, email')
            .eq('id', data.user.id)
            .maybeSingle();

          if (userError) {
            console.error('Error fetching user data:', userError);
            onAuth({
              name: formData.email.split('@')[0],
              email: formData.email
            });
          } else if (userData) {
            onAuth({
              name: userData.name,
              email: userData.email
            });
          } else {
            // User profile doesn't exist, use email as fallback
            onAuth({
              name: formData.email.split('@')[0],
              email: formData.email
            });
          }
          resetFormAndErrors();
        }
      } else {
        // Sign up with Supabase
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              name: formData.name,
            }
          }
        });

        if (error) {
          // Handle specific error for user already exists
          if (error.message === 'User already registered' || error.message.includes('already registered')) {
            setGeneralError('This email is already registered. Please try logging in instead.');
            return;
          }
          throw error;
        }

        if (data.user) {
          // Explicitly create user profile in the users table
          const { error: insertError } = await supabase
            .from('users')
            .insert({
              id: data.user.id,
              name: formData.name,
              email: formData.email,
              profile_visibility: 'public'
            });

          if (insertError) {
            console.error('Error creating user profile:', insertError);
            // Continue anyway - the trigger might have worked
          }

          onAuth({
            name: formData.name,
            email: formData.email
          });
          resetFormAndErrors();
        }
      }
    } catch (error: any) {
      console.error('Authentication error:', error);
      
      // Handle specific authentication errors with more helpful messages
      if (error.message === 'User already registered' || error.message.includes('already registered')) {
        setGeneralError('This email is already registered. Please try logging in instead.');
      } else if (error.message === 'Invalid login credentials' || error.message.includes('Invalid credentials') || error.message.includes('invalid_credentials')) {
        setGeneralError(
          <div className="text-left">
            <p className="font-medium mb-2">Login failed. Please check:</p>
            <ul className="text-sm space-y-1 list-disc list-inside">
              <li>Your email address is correct</li>
              <li>Your password is correct (passwords are case-sensitive)</li>
              <li>You have an account with this email</li>
            </ul>
            <p className="text-sm mt-2">
              <button
                type="button"
                onClick={() => { setShowForgotPassword(true); resetFormAndErrors(); }}
                className="text-blue-400 hover:text-blue-300 underline"
              >
                Forgot your password?
              </button>
              {' '}or{' '}
              <button
                type="button"
                onClick={() => { setIsLogin(false); resetFormAndErrors(); }}
                className="text-blue-400 hover:text-blue-300 underline"
              >
                create a new account
              </button>
            </p>
          </div>
        );
      } else if (error.message.includes('Email not confirmed')) {
        setGeneralError('Please check your email and click the confirmation link before signing in.');
      } else if (error.message.includes('Too many requests')) {
        setGeneralError('Too many login attempts. Please wait a few minutes before trying again.');
      } else {
        setGeneralError(error.message || 'An unexpected error occurred. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPasswordEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!forgotPasswordData.email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
      setEmailError('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    setGeneralError(null);

    try {
      // Send password reset email with Supabase
      const { error } = await supabase.auth.resetPasswordForEmail(
        forgotPasswordData.email,
        {
          redirectTo: window.location.origin,
        }
      );

      if (error) {
        throw error;
      }

      // Show success message
      alert(`Password reset link sent to ${forgotPasswordData.email}. Please check your email.`);
      setShowCodeVerification(true);
    } catch (error: any) {
      console.error('Forgot password error:', error);
      setGeneralError(error.message || 'An error occurred while sending the verification code.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!forgotPasswordData.newPassword || !forgotPasswordData.confirmNewPassword) {
      setGeneralError('Please fill in all fields');
      return;
    }

    if (forgotPasswordData.newPassword.length < 8) {
      setGeneralError('Password must be at least 8 characters long.');
      return;
    }

    if (forgotPasswordData.newPassword !== forgotPasswordData.confirmNewPassword) {
      setGeneralError('Passwords do not match.');
      return;
    }

    setIsLoading(true);

    try {
      // Update password with Supabase
      const { error } = await supabase.auth.updateUser({
        password: forgotPasswordData.newPassword
      });

      if (error) {
        throw error;
      }

      alert('Password changed successfully!');
      setShowForgotPassword(false);
      setShowCodeVerification(false);
      resetFormAndErrors();
    } catch (error: any) {
      console.error('Password reset error:', error);
      setGeneralError(error.message || 'An error occurred while resetting the password.');
    } finally {
      setIsLoading(false);
    }
  };

  // Render for Forgot Password - Code Verification
  if (showForgotPassword && showCodeVerification) {
    return (
      <div className="min-h-screen bg-gray-950 relative overflow-hidden flex items-center justify-center p-4">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-teal-900/20"></div>
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className={`absolute animate-float-slow opacity-10 ${
                i % 4 === 0 ? 'text-blue-400' :
                i % 4 === 1 ? 'text-purple-400' :
                i % 4 === 2 ? 'text-teal-400' : 'text-pink-400'
              }`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                fontSize: `${Math.random() * 20 + 20}px`
              }}
            >
              {i % 4 === 0 ? <BookOpen /> :
               i % 4 === 1 ? <Brain /> :
               i % 4 === 2 ? <GraduationCap /> : <Users />}
            </div>
          ))}
        </div>

        <div className="max-w-md w-full relative z-10">
          {/* Logo and Header */}
          <div className={`text-center mb-8 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-2xl animate-pulse-slow">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-teal-400 bg-clip-text text-transparent mb-2 animate-fade-in">
              Reset Password
            </h1>
            <p className="text-gray-400">Enter your new password and confirm it</p>
          </div>

          {/* Code Verification Form */}
          <div className={`bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-gray-700/50 transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <form onSubmit={handlePasswordReset} className="space-y-6">
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300 mb-2">
                  Enter New Password
                </label>
                <input
                  id="newPassword"
                  type="password"
                  name="newPassword"
                  value={forgotPasswordData.newPassword}
                  onChange={handleForgotPasswordInputChange}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-400"
                  placeholder="Enter your new password"
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-300 mb-2">
                  Confirm Password
                </label>
                <input
                  id="confirmNewPassword"
                  type="password"
                  name="confirmNewPassword"
                  value={forgotPasswordData.confirmNewPassword}
                  onChange={handleForgotPasswordInputChange}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-400"
                  placeholder="Confirm your new password"
                  required
                  disabled={isLoading}
                />
              </div>

              {generalError && <div className="text-red-500 text-sm text-center">{generalError}</div>}

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotPassword(false);
                    setShowCodeVerification(false);
                    resetFormAndErrors();
                  }}
                  className="flex-1 px-6 py-3 border border-gray-600 text-gray-300 rounded-xl hover:bg-gray-800 transition-colors"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-blue-200/20 shadow-lg flex items-center justify-center space-x-2"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Setting Password...</span>
                    </>
                  ) : (
                    'Set Password'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
        
        {/* Bolt.new Badge */}
        <a 
          href="https://bolt.new/" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="fixed bottom-4 right-4 z-50 hover:opacity-90 transition-opacity"
        >
          <img 
            src="/image.png" 
            alt="Powered by Bolt.new" 
            className="h-12 w-auto"
          />
        </a>
      </div>
    );
  }

  // Render for Forgot Password - Email Input
  if (showForgotPassword) {
    return (
      <div className="min-h-screen bg-gray-950 relative overflow-hidden flex items-center justify-center p-4">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-teal-900/20"></div>
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className={`absolute animate-float-slow opacity-10 ${
                i % 4 === 0 ? 'text-blue-400' :
                i % 4 === 1 ? 'text-purple-400' :
                i % 4 === 2 ? 'text-teal-400' : 'text-pink-400'
              }`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                fontSize: `${Math.random() * 20 + 20}px`
              }}
            >
              {i % 4 === 0 ? <BookOpen /> :
               i % 4 === 1 ? <Brain /> :
               i % 4 === 2 ? <GraduationCap /> : <Users />}
            </div>
          ))}
        </div>

        <div className="max-w-md w-full relative z-10">
          {/* Logo and Header */}
          <div className={`text-center mb-8 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-2xl animate-pulse-slow">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-teal-400 bg-clip-text text-transparent mb-2 animate-fade-in">
              Reset Password
            </h1>
            <p className="text-gray-400">Enter your email to receive a verification code</p>
          </div>

          {/* Forgot Password Form */}
          <div className={`bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-gray-700/50 transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <form onSubmit={handleForgotPasswordEmailSubmit} className="space-y-6">
              <div>
                <label htmlFor="forgot-email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="forgot-email"
                    type="email"
                    name="email"
                    value={forgotPasswordData.email}
                    onChange={handleForgotPasswordInputChange}
                    className={`w-full pl-11 pr-4 py-3 bg-gray-800/50 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-400 ${emailError ? 'border-red-500' : 'border-gray-600'}`}
                    placeholder="Enter your email"
                    required
                    disabled={isLoading}
                  />
                </div>
                {emailError && <p className="mt-2 text-sm text-red-500">{emailError}</p>}
              </div>

              {generalError && <div className="text-red-500 text-sm text-center">{generalError}</div>}

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-blue-200/20 shadow-lg flex items-center justify-center space-x-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Sending Reset Link...</span>
                  </>
                ) : (
                  'Send Reset Link'
                )}
              </button>

              <button
                type="button"
                onClick={() => { setShowForgotPassword(false); resetFormAndErrors(); }}
                className="w-full text-gray-400 hover:text-gray-300 text-sm font-medium transition-colors"
                disabled={isLoading}
              >
                Back to Login
              </button>
            </form>
          </div>
        </div>
        
        {/* Bolt.new Badge */}
        <a 
          href="https://bolt.new/" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="fixed bottom-4 right-4 z-50 hover:opacity-90 transition-opacity"
        >
          <img 
            src="/badgeBolt.png" 
            alt="Powered by Bolt.new" 
            className="h-12 w-auto"
          />
        </a>
      </div>
    );
  }

  // Render for Login/Sign Up
  return (
    <div className="min-h-screen bg-gray-950 relative overflow-hidden flex items-center justify-center p-4 sm:p-6">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-teal-900/20"></div>
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={`absolute animate-float-slow opacity-10 ${
              i % 4 === 0 ? 'text-blue-400' :
              i % 4 === 1 ? 'text-purple-400' :
              i % 4 === 2 ? 'text-teal-400' : 'text-pink-400'
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              fontSize: `${Math.random() * 20 + 20}px`
            }}
          >
            {i % 4 === 0 ? <BookOpen /> :
             i % 4 === 1 ? <Brain /> :
             i % 4 === 2 ? <GraduationCap /> : <Users />}
          </div>
        ))}
      </div>

      <div className="max-w-md w-full relative z-10 mx-auto">
        {/* Logo and Header */}
        <div className={`text-center mb-6 sm:mb-8 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-2xl animate-pulse-slow">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-teal-400 bg-clip-text text-transparent mb-2 animate-fade-in">
            StudyMates
          </h1>
          <div className="flex items-center justify-center space-x-2 mb-3 sm:mb-4">
            <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
            <p className="text-lg sm:text-xl font-semibold bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
              Your Growth, Our Community
            </p>
            <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
          </div>
          <p className="text-gray-400 text-sm sm:text-base">
            {isLogin ? 'Welcome back to your learning journey!' : 'Start your learning adventure today!'}
          </p>
        </div>

        {/* Auth Form */}
        <div className={`bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-2xl p-6 sm:p-8 border border-gray-700/50 transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div>
                <label htmlFor="full-name" className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="full-name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full pl-11 pr-4 py-3 bg-gray-800/50 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-400 ${nameError ? 'border-red-500' : 'border-gray-600'}`}
                    placeholder="Enter your full name"
                    required={!isLogin}
                    disabled={isLoading}
                  />
                </div>
                {nameError && <p className="mt-2 text-sm text-red-500">{nameError}</p>}
              </div>
            )}

            <div>
              <label htmlFor="email-address" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="email-address"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full pl-11 pr-4 py-3 bg-gray-800/50 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-400 ${emailError ? 'border-red-500' : 'border-gray-600'}`}
                  placeholder="Enter your email"
                  required
                  disabled={isLoading}
                />
              </div>
              {emailError && <p className="mt-2 text-sm text-red-500">{emailError}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full pl-11 pr-12 py-3 bg-gray-800/50 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-400 ${passwordError ? 'border-red-500' : 'border-gray-600'}`}
                  placeholder="Enter your password"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {passwordError && <p className="mt-2 text-sm text-red-500">{passwordError}</p>}
            </div>

            {!isLogin && (
              <div>
                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-300 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="confirm-password"
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`w-full pl-11 pr-4 py-3 bg-gray-800/50 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-400 ${confirmPasswordError ? 'border-red-500' : 'border-gray-600'}`}
                    placeholder="Confirm your password"
                    required={!isLogin}
                    disabled={isLoading}
                  />
                </div>
                {confirmPasswordError && <p className="mt-2 text-sm text-red-500">{confirmPasswordError}</p>}
              </div>
            )}

            {generalError && (
              <div className="text-red-500 text-sm bg-red-50/10 border border-red-500/20 rounded-lg p-3">
                {generalError}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-blue-200/20 shadow-lg flex items-center justify-center space-x-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>{isLogin ? 'Signing In...' : 'Creating Account...'}</span>
                </>
              ) : (
                <>
                  <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            {isLogin && (
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => { setShowForgotPassword(true); resetFormAndErrors(); }}
                  className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                  disabled={isLoading}
                >
                  Forgot your password?
                </button>
              </div>
            )}
          </form>

          <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-700 text-center">
            <p className="text-gray-400">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                onClick={() => { setIsLogin(!isLogin); resetFormAndErrors(); }}
                className="ml-2 text-blue-400 hover:text-blue-300 font-semibold transition-colors text-sm sm:text-base"
                disabled={isLoading}
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
            
            {/* Skip Sign In Button */}
            <button
              onClick={onSkipSignIn}
              className="mt-4 text-gray-400 hover:text-blue-300 text-sm font-medium transition-colors"
              disabled={isLoading}
            >
              Skip Sign In
            </button>
          </div>
        </div>
      </div>

      {/* Bolt.new Badge */}
      <a 
        href="https://bolt.new/" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="fixed bottom-4 right-4 z-50 hover:opacity-90 transition-opacity"
      >
        <img 
          src="/badgeBolt.png" 
          alt="Powered by Bolt.new" 
          className="h-12 w-auto"
        />
      </a>

      <style jsx>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes fade-in {
          0% { opacity: 0; transform: translateY(-10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
        .animate-fade-in {
          animation: fade-in 2s ease-out;
        }
      `}</style>
    </div>
  );
}