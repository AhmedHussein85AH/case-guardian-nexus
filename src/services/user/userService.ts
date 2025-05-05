
import { supabase } from "@/integrations/supabase/client";
import { User, UserPermissions } from '@/components/users/UserTypes';
import { SupabaseUserProfile } from './userTypes';

// Helper function to get initials from a name
export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(part => part.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');
};

// Convert Supabase user profile to app User format
export const mapSupabaseProfileToUser = (profile: SupabaseUserProfile): User => {
  // Generate a numeric ID from the UUID for compatibility
  const numericId = parseInt(profile.id.replace(/-/g, '').substring(0, 8), 16);
  
  const firstName = profile.first_name || '';
  const lastName = profile.last_name || '';
  const fullName = `${firstName} ${lastName}`.trim() || profile.email;
  
  // Get initials from name
  const initials = getInitials(fullName);
  
  // Default permissions if none exist
  const defaultPermissions: UserPermissions = {
    viewCases: true,
    manageCases: false,
    viewReports: false,
    generateReports: false,
    viewUsers: false,
    manageUsers: false,
    viewMessages: true,
    manageSettings: false,
  };
  
  // Ensure permissions is properly typed
  let userPermissions: UserPermissions;
  
  if (profile.permissions && typeof profile.permissions === 'object') {
    userPermissions = {
      ...defaultPermissions,
      ...(profile.permissions as UserPermissions)
    };
  } else {
    userPermissions = defaultPermissions;
  }
  
  return {
    id: numericId,
    name: fullName,
    email: profile.email,
    role: profile.role || 'User',
    department: profile.department || 'General',
    status: profile.status || 'Active',
    initials: initials,
    permissions: userPermissions,
    originalId: profile.id, // Keep the original UUID for API operations
  };
};

// User functions
export const getAllUserProfiles = async (): Promise<User[]> => {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*');
  
  if (error) {
    console.error("Error fetching user profiles:", error);
    throw error;
  }
  
  // Map Supabase profiles to app User format
  return (data || []).map(profile => mapSupabaseProfileToUser(profile as SupabaseUserProfile));
};

export const getUserProfile = async (userId: string): Promise<User> => {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
  
  return mapSupabaseProfileToUser(data as SupabaseUserProfile);
};

export const updateUserProfile = async (userId: string, updates: any): Promise<User> => {
  const { data, error } = await supabase
    .from('user_profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();
  
  if (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
  
  return mapSupabaseProfileToUser(data as SupabaseUserProfile);
};

export const createUserProfile = async (profile: any): Promise<User> => {
  const { data, error } = await supabase
    .from('user_profiles')
    .insert(profile)
    .select()
    .single();
  
  if (error) {
    console.error("Error creating user profile:", error);
    throw error;
  }
  
  return mapSupabaseProfileToUser(data as SupabaseUserProfile);
};

export const updateUserPermissions = async (userId: string, permissions: UserPermissions): Promise<User> => {
  const { data, error } = await supabase
    .from('user_profiles')
    .update({ permissions })
    .eq('id', userId)
    .select()
    .single();
  
  if (error) {
    console.error("Error updating user permissions:", error);
    throw error;
  }
  
  return mapSupabaseProfileToUser(data as SupabaseUserProfile);
};

export const deleteUserProfile = async (userId: string): Promise<boolean> => {
  const { error } = await supabase
    .from('user_profiles')
    .delete()
    .eq('id', userId);
  
  if (error) {
    console.error("Error deleting user profile:", error);
    throw error;
  }
  
  return true;
};
