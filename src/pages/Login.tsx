
import LoginForm from "@/components/auth/LoginForm";
import { ShieldAlert } from "lucide-react";

const Login = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center">
          <ShieldAlert className="h-12 w-12 text-primary mr-2" />
          <h1 className="text-4xl font-bold">Case Guardian</h1>
        </div>
        <p className="text-muted-foreground mt-2">Security Case Management System</p>
      </div>
      <LoginForm />
    </div>
  );
};

export default Login;
