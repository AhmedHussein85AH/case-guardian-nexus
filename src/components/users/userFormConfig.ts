
export const roleOptions = [
  { value: "Admin", label: "Admin" },
  { value: "Manager", label: "Manager" },
  { value: "CCTV Operator", label: "CCTV Operator" },
];

export const departmentOptions = [
  { value: "Admins", label: "Admins" },
  { value: "Managers", label: "Managers" },
  { value: "Operators", label: "Operators" },
];

export const permissionItems = [
  { id: "viewCases", label: "View Cases" },
  { id: "manageCases", label: "Manage Cases" },
  { id: "viewReports", label: "View Reports" },
  { id: "generateReports", label: "Generate Reports" },
  { id: "viewUsers", label: "View Users" },
  { id: "manageUsers", label: "Manage Users" },
  { id: "viewMessages", label: "View Messages" },
  { id: "manageSettings", label: "Manage Settings" },
];

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

export const getDefaultPermissions = (role: string): UserPermissions => {
  let permissions: UserPermissions = {
    viewCases: false,
    manageCases: false,
    viewReports: false,
    generateReports: false,
    viewUsers: false,
    manageUsers: false,
    viewMessages: false,
    manageSettings: false,
  };

  switch (role) {
    case "Admin":
      permissions = {
        viewCases: true,
        manageCases: true,
        viewReports: true,
        generateReports: true,
        viewUsers: true,
        manageUsers: true,
        viewMessages: true,
        manageSettings: true,
      };
      break;
    case "Manager":
      permissions = {
        viewCases: true,
        manageCases: true,
        viewReports: true,
        generateReports: true,
        viewUsers: true,
        manageUsers: false,
        viewMessages: true,
        manageSettings: false,
      };
      break;
    case "CCTV Operator":
      permissions = {
        viewCases: true,
        manageCases: false,
        viewReports: false,
        generateReports: false,
        viewUsers: false,
        manageUsers: false,
        viewMessages: true,
        manageSettings: false,
      };
      break;
  }

  return permissions;
};
