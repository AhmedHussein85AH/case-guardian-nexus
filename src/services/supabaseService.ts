
import { supabase } from "@/integrations/supabase/client";
import { Case } from "@/types/case";

// Case functions
export const getAllCases = async (): Promise<Case[]> => {
  const { data, error } = await supabase
    .from('Cases Management')
    .select('*');
  
  if (error) {
    console.error("Error fetching cases:", error);
    throw error;
  }
  
  return data as Case[] || [];
};

export const getCaseById = async (id: string): Promise<Case | null> => {
  const { data, error } = await supabase
    .from('Cases Management')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    if (error.code === 'PGRST116') { // Not found error code
      return null;
    }
    console.error("Error fetching case:", error);
    throw error;
  }
  
  return data as Case;
};

export const saveCase = async (caseData: Case): Promise<Case> => {
  const { data, error } = await supabase
    .from('Cases Management')
    .upsert(caseData)
    .select()
    .single();
  
  if (error) {
    console.error("Error saving case:", error);
    throw error;
  }
  
  return data as Case;
};

export const createCase = async (caseData: Omit<Case, 'id'>): Promise<Case> => {
  // Generate a UUID client-side for better UX (avoid waiting for server response)
  const newCaseId = crypto.randomUUID();
  const caseIdNumber = Math.floor(10000 + Math.random() * 90000);
  
  const newCase: Case = {
    ...caseData,
    id: newCaseId,
    caseId: `CG-${caseIdNumber}`
  };
  
  const { data, error } = await supabase
    .from('Cases Management')
    .insert(newCase)
    .select()
    .single();
  
  if (error) {
    console.error("Error creating case:", error);
    throw error;
  }
  
  return data as Case;
};

export const deleteCase = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('Cases Management')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error("Error deleting case:", error);
    throw error;
  }
  
  return true;
};

// User functions
export const getAllUserProfiles = async () => {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*');
  
  if (error) {
    console.error("Error fetching user profiles:", error);
    throw error;
  }
  
  return data || [];
};

export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
  
  return data;
};

export const updateUserProfile = async (userId: string, updates: any) => {
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
  
  return data;
};

export const createUserProfile = async (profile: any) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .insert(profile)
    .select()
    .single();
  
  if (error) {
    console.error("Error creating user profile:", error);
    throw error;
  }
  
  return data;
};

export const updateUserPermissions = async (userId: string, permissions: any) => {
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
  
  return data;
};

// Authentication helpers
export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  
  if (error) {
    console.error("Error getting current user:", error);
    throw error;
  }
  
  return data.user;
};

export const getCurrentSession = async () => {
  const { data, error } = await supabase.auth.getSession();
  
  if (error) {
    console.error("Error getting current session:", error);
    throw error;
  }
  
  return data.session;
};
