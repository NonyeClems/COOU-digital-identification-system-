/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'admin' | 'staff' | 'student';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: UserRole;
  studentId?: string; // Links to the student record if role is 'student'
}

export interface Student {
  id: string; // The generated student identification number
  docId: string; // Firestore document ID
  name: string;
  email: string;
  department: string;
  level: string; // e.g., '100L', '200L'
  passportURL: string;
  createdAt: number;
  updatedAt: number;
  status: 'active' | 'suspended' | 'graduated';
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: 'create' | 'update' | 'delete' | 'list' | 'get' | 'write';
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
  }
}
