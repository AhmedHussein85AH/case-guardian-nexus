
import { Case, CasePriority, CaseStatus, CaseType } from "@/types/case";
import { getRecentCases } from "@/data/mockCases";

// Local storage keys
const CASES_STORAGE_KEY = "case-guardian-cases";
const NOTIFICATIONS_STORAGE_KEY = "case-guardian-notifications";

// Initialize data if not present
const initializeDataIfNeeded = () => {
  if (!localStorage.getItem(CASES_STORAGE_KEY)) {
    // Initialize with mock data
    const initialCases = getRecentCases(30);
    localStorage.setItem(CASES_STORAGE_KEY, JSON.stringify(initialCases));
  }

  if (!localStorage.getItem(NOTIFICATIONS_STORAGE_KEY)) {
    // Initialize with mock notifications
    const initialNotifications = [
      {
        id: 1,
        title: "New case assigned",
        description: "Case #12345 has been assigned to you",
        time: "5 minutes ago",
        read: false,
      },
      {
        id: 2,
        title: "High priority case updated",
        description: "Case #12342 has been updated",
        time: "1 hour ago",
        read: false,
      },
      {
        id: 3,
        title: "System update",
        description: "New features have been added to the system",
        time: "1 day ago",
        read: true,
      }
    ];
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(initialNotifications));
  }
};

// Initialize on service load
initializeDataIfNeeded();

// Case functions
export const getAllCases = (): Case[] => {
  const casesData = localStorage.getItem(CASES_STORAGE_KEY);
  return casesData ? JSON.parse(casesData) : [];
};

export const getCaseById = (id: string): Case | undefined => {
  const cases = getAllCases();
  return cases.find(c => c.id === id);
};

export const saveCase = (caseData: Case): Case => {
  const cases = getAllCases();
  const existingIndex = cases.findIndex(c => c.id === caseData.id);

  if (existingIndex >= 0) {
    // Update existing case
    cases[existingIndex] = caseData;
  } else {
    // Add new case
    cases.push(caseData);
  }

  localStorage.setItem(CASES_STORAGE_KEY, JSON.stringify(cases));
  return caseData;
};

export const createCase = (caseData: Omit<Case, 'id'>): Case => {
  const newCase: Case = {
    ...caseData,
    id: crypto.randomUUID(),
    caseId: `CG-${Math.floor(10000 + Math.random() * 90000)}`
  };
  
  const cases = getAllCases();
  cases.push(newCase);
  localStorage.setItem(CASES_STORAGE_KEY, JSON.stringify(cases));
  
  // Add notification for new case
  addNotification({
    id: Date.now(),
    title: "New case created",
    description: `Case ${newCase.caseId} has been created`,
    time: "Just now",
    read: false
  });
  
  return newCase;
};

export const deleteCase = (id: string): boolean => {
  const cases = getAllCases();
  const newCases = cases.filter(c => c.id !== id);
  
  if (cases.length === newCases.length) {
    return false; // Case not found
  }
  
  localStorage.setItem(CASES_STORAGE_KEY, JSON.stringify(newCases));
  return true;
};

export const updateCaseStatus = (id: string, status: CaseStatus): Case | undefined => {
  const cases = getAllCases();
  const caseIndex = cases.findIndex(c => c.id === id);
  
  if (caseIndex === -1) {
    return undefined;
  }
  
  cases[caseIndex].status = status;
  localStorage.setItem(CASES_STORAGE_KEY, JSON.stringify(cases));
  
  // Add notification for status update
  addNotification({
    id: Date.now(),
    title: "Case status updated",
    description: `Case ${cases[caseIndex].caseId} status changed to ${status}`,
    time: "Just now",
    read: false
  });
  
  return cases[caseIndex];
};

// Notification functions
export type Notification = {
  id: number;
  title: string;
  description: string;
  time: string;
  read: boolean;
};

export const getAllNotifications = (): Notification[] => {
  const notificationsData = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
  return notificationsData ? JSON.parse(notificationsData) : [];
};

export const getUnreadNotificationsCount = (): number => {
  const notifications = getAllNotifications();
  return notifications.filter(n => !n.read).length;
};

export const getNotificationById = (id: number): Notification | undefined => {
  const notifications = getAllNotifications();
  return notifications.find(n => n.id === id);
};

export const addNotification = (notification: Notification): void => {
  const notifications = getAllNotifications();
  notifications.unshift(notification); // Add to the beginning
  localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(notifications));
};

export const markNotificationAsRead = (id: number): void => {
  const notifications = getAllNotifications();
  const notificationIndex = notifications.findIndex(n => n.id === id);
  
  if (notificationIndex !== -1) {
    notifications[notificationIndex].read = true;
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(notifications));
  }
};

export const markAllNotificationsAsRead = (): void => {
  const notifications = getAllNotifications();
  const updatedNotifications = notifications.map(n => ({ ...n, read: true }));
  localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(updatedNotifications));
};

export const deleteNotification = (id: number): void => {
  const notifications = getAllNotifications();
  const filteredNotifications = notifications.filter(n => n.id !== id);
  localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(filteredNotifications));
};

// Export data to CSV
export const exportCasesCSV = (): string => {
  const cases = getAllCases();
  const headers = "Case ID,Type,Status,Priority,Description,Location,Incident Date\n";
  
  const rows = cases.map(c => {
    return `"${c.caseId}","${c.caseType}","${c.status}","${c.priority}","${c.description.replace(/"/g, '""')}","${c.location.replace(/"/g, '""')}","${c.incidentDate}"`;
  }).join("\n");
  
  return headers + rows;
};

export const downloadCSV = (filename: string, csvContent: string): void => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
