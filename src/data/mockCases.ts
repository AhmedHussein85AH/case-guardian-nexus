
import { Case, CasePriority, CaseStatus, CaseType } from "@/types/case";

// Helper function to generate a random date within the last 30 days
const randomDate = (daysBack: number = 30): string => {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysBack));
  return date.toISOString();
};

// Helper function to generate a random time
const randomTime = (): string => {
  const hours = Math.floor(Math.random() * 24).toString().padStart(2, '0');
  const minutes = Math.floor(Math.random() * 60).toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

// Helper function to generate a random case ID
const generateCaseId = (): string => {
  return `CG-${Math.floor(10000 + Math.random() * 90000)}`;
};

// Helper function to randomly select from an array
const randomSelect = <T>(items: T[]): T => {
  return items[Math.floor(Math.random() * items.length)];
};

// Generate mock cases
export const generateMockCases = (count: number = 20): Case[] => {
  const caseTypes: CaseType[] = ['theft', 'vandalism', 'traffic', 'assault', 'trespassing', 'other'];
  const priorities: CasePriority[] = ['low', 'medium', 'high'];
  const statuses: CaseStatus[] = ['new', 'inprogress', 'resolved'];
  const villages = ['North Village', 'South Village', 'East Village', 'West Village', 'Central Village'];
  const locations = [
    'Main Street', 'Park Avenue', 'Shopping Center', 'Residential Area', 
    'Parking Lot', 'Business District', 'Highway Intersection'
  ];
  const operatorNames = ['John Smith', 'Jane Doe', 'Alex Johnson', 'Sarah Williams', 'Michael Brown'];
  const tags = ['urgent', 'followup', 'evidence', 'witness', 'vehicle', 'property', 'suspect'];

  const cases: Case[] = [];

  for (let i = 0; i < count; i++) {
    const createdAt = randomDate();
    const updatedAt = new Date(new Date(createdAt).getTime() + Math.random() * 86400000).toISOString();
    const incidentDate = randomDate();

    const tagsCount = Math.floor(Math.random() * 3);
    const caseTags: string[] = [];
    for (let j = 0; j < tagsCount; j++) {
      const tag = randomSelect(tags);
      if (!caseTags.includes(tag)) {
        caseTags.push(tag);
      }
    }

    const caseType = randomSelect(caseTypes);
    const priority = randomSelect(priorities);
    const status = randomSelect(statuses);

    cases.push({
      id: `case-${i+1}`,
      caseId: generateCaseId(),
      caseType,
      description: `This is a ${caseType} case that occurred at ${randomSelect(locations)}. Requires ${priority} priority attention.`,
      incidentDate,
      incidentTime: randomTime(),
      location: randomSelect(locations),
      unitNumber: Math.random() > 0.5 ? `Unit-${Math.floor(100 + Math.random() * 900)}` : undefined,
      village: Math.random() > 0.3 ? randomSelect(villages) : undefined,
      priority,
      cctvFootage: Math.random() > 0.5,
      operatorName: randomSelect(operatorNames),
      receivedAt: createdAt,
      status,
      tags: tagsCount > 0 ? caseTags : undefined,
      followUpActions: Math.random() > 0.7 ? 'Follow up with witnesses and check for additional evidence.' : undefined,
      createdAt,
      updatedAt
    });
  }

  return cases;
};

export const mockCases = generateMockCases(50);

export const getRecentCases = (count: number = 5): Case[] => {
  return [...mockCases]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, count);
};

export const getCaseById = (id: string): Case | undefined => {
  return mockCases.find(c => c.id === id || c.caseId === id);
};

export const getCasesByStatus = (status: CaseStatus): Case[] => {
  return mockCases.filter(c => c.status === status);
};

export const getCasesByPriority = (priority: CasePriority): Case[] => {
  return mockCases.filter(c => c.priority === priority);
};

export const getCasesByType = (type: CaseType): Case[] => {
  return mockCases.filter(c => c.caseType === type);
};

export const getStatusCount = (): Record<CaseStatus, number> => {
  return {
    new: mockCases.filter(c => c.status === 'new').length,
    inprogress: mockCases.filter(c => c.status === 'inprogress').length,
    resolved: mockCases.filter(c => c.status === 'resolved').length,
  };
};

export const getPriorityCount = (): Record<CasePriority, number> => {
  return {
    low: mockCases.filter(c => c.priority === 'low').length,
    medium: mockCases.filter(c => c.priority === 'medium').length,
    high: mockCases.filter(c => c.priority === 'high').length,
  };
};

export const getTypeCount = (): Record<CaseType, number> => {
  const result: Record<string, number> = {};
  
  caseTypes.forEach(type => {
    result[type] = mockCases.filter(c => c.caseType === type).length;
  });
  
  return result as Record<CaseType, number>;
};

export const caseTypes: CaseType[] = ['theft', 'vandalism', 'traffic', 'assault', 'trespassing', 'other'];
export const priorities: CasePriority[] = ['low', 'medium', 'high'];
export const statuses: CaseStatus[] = ['new', 'inprogress', 'resolved'];
