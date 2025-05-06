
import { supabase } from "@/integrations/supabase/client";
import { Case, CasePriority, CaseStatus, CaseType } from "@/types/case";

// Define the SupabaseCase type explicitly to match the structure in the "Cases Management" table
export interface SupabaseCase {
  id: string;
  "Case ID": string;
  Description: string;
  "Incident Date": string;
  Location: string;
  Priority: string;
  Status: string;
  Type: string;
}

export const mapSupabaseCaseToAppCase = (dbCase: SupabaseCase): Case => {
  // Convert database types to app types
  return {
    id: dbCase.id || "",
    caseId: dbCase["Case ID"] || "",
    description: dbCase.Description || "",
    status: dbCase.Status as CaseStatus || "new",
    priority: dbCase.Priority as CasePriority || "medium",
    caseType: dbCase.Type as CaseType || "other",
    location: dbCase.Location || "",
    incidentDate: dbCase["Incident Date"] || "",
    incidentTime: "", // Default since it's not in the database
    operatorName: "", // Default since it's not in the database
    receivedAt: "", // Default since it's not in the database
    createdAt: "", // Default since it's not in the database
    updatedAt: "", // Default since it's not in the database
  };
};

export const mapAppCaseToSupabaseCase = (appCase: Case): Partial<SupabaseCase> => {
  return {
    "Case ID": appCase.caseId,
    Description: appCase.description,
    Status: appCase.status,
    Priority: appCase.priority,
    Type: appCase.caseType,
    Location: appCase.location,
    "Incident Date": appCase.incidentDate,
  };
};

export const getAllCases = async (): Promise<Case[]> => {
  const { data, error } = await supabase
    .from("Cases Management")
    .select('*');
  
  if (error) {
    console.error("Error fetching cases:", error);
    throw error;
  }
  
  // Convert Supabase format to our app's Case format
  return (data || []).map((caseItem) => mapSupabaseCaseToAppCase(caseItem as unknown as SupabaseCase));
};

export const getCaseById = async (caseId: string): Promise<Case | null> => {
  const { data, error } = await supabase
    .from("Cases Management")
    .select('*')
    .eq('Case ID', caseId)
    .single();
  
  if (error) {
    console.error("Error fetching case by ID:", error);
    throw error;
  }
  
  // Convert Supabase format to our app's Case format
  return data ? mapSupabaseCaseToAppCase(data as unknown as SupabaseCase) : null;
};

export const createCase = async (newCase: Omit<Case, 'id' | 'createdAt' | 'updatedAt'>): Promise<Case> => {
  const supabaseCase = mapAppCaseToSupabaseCase(newCase as Case);

  const { data, error } = await supabase
    .from("Cases Management")
    .insert([supabaseCase as any])
    .select()
    .single();

  if (error) {
    console.error("Error creating case:", error);
    throw error;
  }

  // Convert Supabase format to our app's Case format
  return mapSupabaseCaseToAppCase(data as unknown as SupabaseCase);
};

export const saveCase = async (caseId: string, updates: Partial<Case>): Promise<Case> => {
  const supabaseUpdates = mapAppCaseToSupabaseCase(updates as Case);
  
  const { data, error } = await supabase
    .from("Cases Management")
    .update(supabaseUpdates as any)
    .eq('Case ID', caseId)
    .select()
    .single();
  
  if (error) {
    console.error("Error saving case:", error);
    throw error;
  }
  
  // Convert Supabase format to our app's Case format
  return mapSupabaseCaseToAppCase(data as unknown as SupabaseCase);
};

export const deleteCase = async (caseId: string): Promise<boolean> => {
  const { error } = await supabase
    .from("Cases Management")
    .delete()
    .eq('Case ID', caseId);
  
  if (error) {
    console.error("Error deleting case:", error);
    throw error;
  }
  
  return true;
};
