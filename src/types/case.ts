
export type CasePriority = 'low' | 'medium' | 'high';
export type CaseStatus = 'new' | 'inprogress' | 'resolved';
export type CaseType = 'theft' | 'vandalism' | 'traffic' | 'assault' | 'trespassing' | 'other';

export interface CaseAttachment {
  id: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  uploadedAt: string;
  url: string;
}

export interface CasePerson {
  id: string;
  name: string;
  contactInfo?: string;
  role?: string;
}

export interface CaseVehicle {
  id: string;
  make?: string;
  model?: string;
  licensePlate?: string;
  color?: string;
}

export interface Case {
  id: string;
  caseId: string;
  caseType: CaseType;
  description: string;
  incidentDate: string;
  incidentTime: string;
  location: string;
  unitNumber?: string;
  village?: string;
  priority: CasePriority;
  cctvFootage?: boolean;
  attachments?: CaseAttachment[];
  operatorName: string;
  receivedAt: string;
  realTimeUpdate?: string;
  persons?: CasePerson[];
  vehicles?: CaseVehicle[];
  status: CaseStatus;
  relatedCases?: string[];
  tags?: string[];
  followUpActions?: string;
  createdAt: string;
  updatedAt: string;
}
