
import { supabase } from "@/integrations/supabase/client";

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

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  
  if (error) {
    console.error("Error signing in:", error);
    throw error;
  }
  
  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    console.error("Error signing out:", error);
    throw error;
  }
  
  return true;
};

export const resetPassword = async (email: string) => {
  // Use the correct format for resetPasswordForEmail without redirectTo
  // This avoids the type error with the redirectTo parameter
  const { error } = await supabase.auth.resetPasswordForEmail(email);
  
  if (error) {
    console.error("Error resetting password:", error);
    throw error;
  }
  
  return true;
};

export const isAdmin = async (userId: string) => {
  try {
    const { data: adminResult, error: adminError } = await supabase.rpc('is_admin_by_id', {
      user_id: userId
    });
    
    if (adminError) {
      console.error("Admin check failed:", adminError);
      return false;
    }
    
    return adminResult === true;
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
};
