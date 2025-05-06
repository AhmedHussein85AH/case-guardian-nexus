import { supabase } from "@/integrations/supabase/client";
import { Case } from "@/types/case";

// Define the SupabaseCase type explicitly to avoid excessive type instantiation
export interface SupabaseCase {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  created_at: string;
  updated_at: string;
  assignee_id?: string;
  case_number: string;
  type: string;
  location?: string;
  incident_date?: string;
}

export const mapSupabaseCaseToAppCase = (dbCase: SupabaseCase): Case => {
  return {
    id: dbCase.id,
    title: dbCase.title || "",
    description: dbCase.description || "",
    status: dbCase.status || "Open",
    priority: dbCase.priority || "Medium",
    caseNumber: dbCase.case_number || "",
    type: dbCase.type || "General",
    assigneeId: dbCase.assignee_id,
    createdAt: dbCase.created_at ? new Date(dbCase.created_at) : new Date(),
    updatedAt: dbCase.updated_at ? new Date(dbCase.updated_at) : new Date(),
    location: dbCase.location || "",
    incidentDate: dbCase.incident_date || ""
  };
};

export const mapAppCaseToSupabaseCase = (appCase: Case): Partial<SupabaseCase> => {
  return {
    title: appCase.title,
    description: appCase.description,
    status: appCase.status,
    priority: appCase.priority,
    assignee_id: appCase.assigneeId,
    type: appCase.type,
    case_number: appCase.caseNumber,
    location: appCase.location,
    incident_date: appCase.incidentDate
  };
};

export const getAllCases = async (): Promise<Case[]> => {
  const { data, error } = await supabase
    .from('cases')
    .select('*');
  
  if (error) {
    console.error("Error fetching cases:", error);
    throw error;
  }
  
  // Convert Supabase format to our app's Case format with proper type casting
  return (data || []).map((caseItem) => mapSupabaseCaseToAppCase(caseItem as SupabaseCase));
};

export const getCaseById = async (caseId: string): Promise<Case | null> => {
  const { data, error } = await supabase
    .from('cases')
    .select('*')
    .eq('id', caseId)
    .single();
  
  if (error) {
    console.error("Error fetching case by ID:", error);
    throw error;
  }
  
  // Convert Supabase format to our app's Case format with proper type casting
  return data ? mapSupabaseCaseToAppCase(data as SupabaseCase) : null;
};

export const createCase = async (newCase: Omit<Case, 'id' | 'createdAt' | 'updatedAt'>): Promise<Case> => {
  const supabaseCase = mapAppCaseToSupabaseCase(newCase);

  const { data, error } = await supabase
    .from('cases')
    .insert([supabaseCase])
    .select()
    .single();

  if (error) {
    console.error("Error creating case:", error);
    throw error;
  }

  // Convert Supabase format to our app's Case format with proper type casting
  return mapSupabaseCaseToAppCase(data as SupabaseCase);
};

export const saveCase = async (caseId: string, updates: Partial<Case>): Promise<Case> => {
  const supabaseUpdates = mapAppCaseToSupabaseCase(updates as Case);
  
  const { data, error } = await supabase
    .from('cases')
    .update(supabaseUpdates)
    .eq('id', caseId)
    .select()
    .single();
  
  if (error) {
    console.error("Error saving case:", error);
    throw error;
  }
  
  // Convert Supabase format to our app's Case format with proper type casting
  return mapSupabaseCaseToAppCase(data as SupabaseCase);
};

export const deleteCase = async (caseId: string): Promise<boolean> => {
  const { error } = await supabase
    .from('cases')
    .delete()
    .eq('id', caseId);
  
  if (error) {
    console.error("Error deleting case:", error);
    throw error;
  }
  
  return true;
};
