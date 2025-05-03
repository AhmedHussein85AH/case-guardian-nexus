
export type UserPermissions = {
  viewCases: boolean;
  manageCases: boolean;
  viewReports: boolean;
  generateReports: boolean;
  viewUsers: boolean;
  manageUsers: boolean;
  viewMessages: boolean;
  manageSettings: boolean;
};

export type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  department: string;
  status: string;
  initials: string;
  permissions?: UserPermissions;
};
