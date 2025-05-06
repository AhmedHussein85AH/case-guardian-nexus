
// Re-export all services from the central file for backward compatibility
// This ensures existing imports will continue to work

import { 
  getAllCases, 
  getCaseById, 
  saveCase, 
  createCase, 
  deleteCase,
  mapSupabaseCaseToAppCase,
  mapAppCaseToSupabaseCase,
} from './case/caseService';

import {
  getAllUserProfiles,
  getUserProfile,
  updateUserProfile,
  createUserProfile,
  updateUserPermissions,
  deleteUserProfile,
  mapSupabaseProfileToUser,
  getInitials
} from './user/userService';

import {
  getCurrentUser,
  getCurrentSession,
  signIn,
  signOut,
  resetPassword,
  isAdmin
} from './auth/authService';

// Re-export the type with 'export type' syntax
import type { SupabaseCase } from './case/caseService';

export {
  // Case services
  getAllCases,
  getCaseById,
  saveCase,
  createCase,
  deleteCase,
  mapSupabaseCaseToAppCase,
  mapAppCaseToSupabaseCase,
  
  // User services
  getAllUserProfiles,
  getUserProfile,
  updateUserProfile,
  createUserProfile,
  updateUserPermissions,
  deleteUserProfile,
  mapSupabaseProfileToUser,
  getInitials,
  
  // Auth services
  getCurrentUser,
  getCurrentSession,
  signIn,
  signOut,
  resetPassword,
  isAdmin
};

// Export the type with proper syntax for isolatedModules
export type { SupabaseCase };
