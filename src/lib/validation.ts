/**
 * Shared validation schemas using Zod
 * These schemas are reused on both client and server for consistent validation
 */
import { z } from 'zod';

/**
 * Schema for message submission
 * Used for validating contact form data
 */
export const messageSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name is too long'),
  email: z.string().email('Invalid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(1000, 'Message is too long'),
});

/**
 * TypeScript type inferred from the Zod schema
 * This ensures type safety across the application
 */
export type MessageFormData = z.infer<typeof messageSchema>;

/**
 * Schema for login credentials
 */
export const loginSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
