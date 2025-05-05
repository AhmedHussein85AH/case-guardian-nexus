
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
  SupabaseCase
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

export {
  // Case services
  getAllCases,
  getCaseById,
  saveCase,
  createCase,
  deleteCase,
  mapSupabaseCaseToAppCase,
  mapAppCaseToSupabaseCase,
  SupabaseCase,
  
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
