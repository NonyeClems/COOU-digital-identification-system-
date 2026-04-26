import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges Tailwind CSS classes effectively.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generates a unique student ID.
 * Format: {YEAR}{DEPT_CODE}{RANDOM_4_DIGITS}
 * Example: 2026CS1234
 */
export function generateStudentId(department: string) {
  const year = new Date().getFullYear();
  const deptCode = department.substring(0, 2).toUpperCase();
  const randomDigits = Math.floor(1000 + Math.random() * 9000);
  return `${year}${deptCode}${randomDigits}`;
}

/**
 * Formats a timestamp into a readable date.
 */
export function formatDate(timestamp: number) {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(timestamp));
}
