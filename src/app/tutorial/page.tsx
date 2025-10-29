'use client';

/**
 * Contact Form Example with Raw React Hooks
 * 
 * This demonstrates:
 * - Using useReducer for form state management (instead of state libraries)
 * - Client-side validation with Zod
 * - JWT authentication with Bearer token
 * - Controlled components
 * - Inline error display
 */

import { useReducer, useState } from 'react';
import { messageSchema, type MessageFormData } from '@/lib/validation';
import { ZodError } from 'zod';

// State type for the form reducer
interface FormState {
  name: string;
  email: string;
  message: string;
  errors: Partial<Record<keyof MessageFormData, string>>;
  isSubmitting: boolean;
  submitSuccess: boolean;
  submitError: string | null;
}

// Action types for the reducer
type FormAction =
  | { type: 'SET_FIELD'; field: keyof MessageFormData; value: string }
  | { type: 'SET_ERRORS'; errors: Partial<Record<keyof MessageFormData, string>> }
  | { type: 'CLEAR_ERRORS' }
  | { type: 'SET_SUBMITTING'; isSubmitting: boolean }
  | { type: 'SUBMIT_SUCCESS' }
  | { type: 'SUBMIT_ERROR'; error: string }
  | { type: 'RESET_FORM' };

// Initial state
const initialState: FormState = {
  name: '',
  email: '',
  message: '',
  errors: {},
  isSubmitting: false,
  submitSuccess: false,
  submitError: null,
};

// Reducer function
function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case 'SET_FIELD':
      return {
        ...state,
        [action.field]: action.value,
        errors: { ...state.errors, [action.field]: undefined },
        submitError: null,
      };
    case 'SET_ERRORS':
      return { ...state, errors: action.errors };
    case 'CLEAR_ERRORS':
      return { ...state, errors: {} };
    case 'SET_SUBMITTING':
      return { ...state, isSubmitting: action.isSubmitting };
    case 'SUBMIT_SUCCESS':
      return { ...state, isSubmitting: false, submitSuccess: true, submitError: null };
    case 'SUBMIT_ERROR':
      return { ...state, isSubmitting: false, submitSuccess: false, submitError: action.error };
    case 'RESET_FORM':
      return initialState;
    default:
      return state;
  }
}

export default function ContactFormPage() {
  const [state, dispatch] = useReducer(formReducer, initialState);
  const [token, setToken] = useState<string | null>(null);
  const [loginUsername, setLoginUsername] = useState('demo');
  const [loginPassword, setLoginPassword] = useState('demo123');
  const [loginError, setLoginError] = useState<string | null>(null);

  // Handle login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: loginUsername,
          password: loginPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setLoginError(data.error || 'Login failed');
        return;
      }

      setToken(data.token);
      console.log('Logged in as:', data.user.username);
    } catch (error) {
      setLoginError('Network error during login');
      console.error('Login error:', error);
    }
  };

  // Handle logout
  const handleLogout = () => {
    setToken(null);
    dispatch({ type: 'RESET_FORM' });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous errors and set submitting state
    dispatch({ type: 'CLEAR_ERRORS' });
    dispatch({ type: 'SET_SUBMITTING', isSubmitting: true });

    // Client-side validation with Zod
    try {
      const formData: MessageFormData = {
        name: state.name,
        email: state.email,
        message: state.message,
      };

      // Validate using the same schema as the server
      messageSchema.parse(formData);

      // If validation passes, submit to server
      if (!token) {
        dispatch({ type: 'SUBMIT_ERROR', error: 'Please login first' });
        return;
      }

      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        dispatch({ type: 'SUBMIT_ERROR', error: data.message || 'Failed to submit message' });
        return;
      }

      dispatch({ type: 'SUBMIT_SUCCESS' });
      console.log('Message submitted successfully:', data);

      // Reset form after 2 seconds
      setTimeout(() => {
        dispatch({ type: 'RESET_FORM' });
      }, 2000);

    } catch (error) {
      if (error instanceof ZodError) {
        // Convert Zod errors to our error format
        const fieldErrors: Partial<Record<keyof MessageFormData, string>> = {};
        error.issues.forEach((issue) => {
          if (issue.path[0]) {
            fieldErrors[issue.path[0] as keyof MessageFormData] = issue.message;
          }
        });
        dispatch({ type: 'SET_ERRORS', errors: fieldErrors });
        dispatch({ type: 'SET_SUBMITTING', isSubmitting: false });
      } else {
        dispatch({ type: 'SUBMIT_ERROR', error: 'An unexpected error occurred' });
        console.error('Submission error:', error);
      }
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Contact Form Tutorial</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Next.js + TypeScript + Zod + React Hooks (useReducer)
        </p>

        {/* Login Section */}
        {!token ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4">Step 1: Login</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Demo credentials: username: <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">demo</code>, 
              password: <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">demo123</code>
            </p>
            
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium mb-1">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-1">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700"
                  required
                />
              </div>

              {loginError && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400">
                  {loginError}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                Login
              </button>
            </form>
          </div>
        ) : (
          <>
            {/* Logged in status */}
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6 flex justify-between items-center">
              <span className="text-green-700 dark:text-green-400">
                ✓ Logged in successfully
              </span>
              <button
                onClick={handleLogout}
                className="text-sm bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded"
              >
                Logout
              </button>
            </div>

            {/* Contact Form */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4">Step 2: Submit Message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name Field */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={state.name}
                    onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'name', value: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 ${
                      state.errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder="Enter your name"
                    disabled={state.isSubmitting}
                  />
                  {state.errors.name && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{state.errors.name}</p>
                  )}
                </div>

                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={state.email}
                    onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'email', value: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 ${
                      state.errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder="your.email@example.com"
                    disabled={state.isSubmitting}
                  />
                  {state.errors.email && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{state.errors.email}</p>
                  )}
                </div>

                {/* Message Field */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-1">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    value={state.message}
                    onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'message', value: e.target.value })}
                    rows={5}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 ${
                      state.errors.message ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder="Enter your message (at least 10 characters)"
                    disabled={state.isSubmitting}
                  />
                  {state.errors.message && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{state.errors.message}</p>
                  )}
                </div>

                {/* Submit Error */}
                {state.submitError && (
                  <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400">
                    {state.submitError}
                  </div>
                )}

                {/* Submit Success */}
                {state.submitSuccess && (
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-700 dark:text-green-400">
                    ✓ Message submitted successfully!
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={state.isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  {state.isSubmitting ? 'Submitting...' : 'Submit Message'}
                </button>
              </form>
            </div>
          </>
        )}

        {/* Implementation Notes */}
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <h3 className="text-lg font-bold mb-2">Implementation Highlights:</h3>
          <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 dark:text-gray-300">
            <li>Uses <code className="bg-white dark:bg-gray-800 px-1 rounded">useReducer</code> for form state management (no external libraries)</li>
            <li>Zod schema shared between client and server for validation</li>
            <li>JWT authentication with Bearer token in Authorization header</li>
            <li>Controlled components for all form inputs</li>
            <li>Inline validation error display</li>
            <li>TypeScript for type safety throughout</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
