
import { z } from "zod";
import { UserPermissions } from "./userFormConfig";

export const editUserSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().optional(),
  role: z.string().min(1, { message: "Please select a role." }),
  department: z.string().min(1, { message: "Please select a department." }),
  status: z.string().min(1, { message: "Please select a status." }),
  permissions: z.object({
    viewCases: z.boolean().default(false),
    manageCases: z.boolean().default(false),
    viewReports: z.boolean().default(false),
    generateReports: z.boolean().default(false),
    viewUsers: z.boolean().default(false),
    manageUsers: z.boolean().default(false),
    viewMessages: z.boolean().default(false),
    manageSettings: z.boolean().default(false),
  }).default({
    viewCases: false,
    manageCases: false,
    viewReports: false,
    generateReports: false,
    viewUsers: false,
    manageUsers: false,
    viewMessages: false,
    manageSettings: false,
  }),
});

export type EditUserFormValues = z.infer<typeof editUserSchema>;
