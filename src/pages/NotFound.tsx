
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ShieldAlert, Home, ArrowLeft, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  const goBack = () => navigate(-1);
  const goHome = () => navigate("/");
  const goSearch = () => navigate("/search");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md shadow-lg border-t-4 border-t-primary animate-fade-in">
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="bg-primary/10 inline-flex items-center justify-center p-6 rounded-full mb-6">
              <ShieldAlert className="h-16 w-16 text-primary" />
            </div>
            
            <h1 className="text-5xl font-bold mb-2">404</h1>
            <p className="text-2xl font-semibold text-gray-700 mb-2">Page Not Found</p>
            <p className="text-gray-500 mb-8">
              The case file you're looking for doesn't exist or has been moved to a different location.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Button 
                variant="outline" 
                className="flex items-center justify-center gap-2" 
                onClick={goBack}
              >
                <ArrowLeft className="h-4 w-4" />
                Go Back
              </Button>
              
              <Button 
                variant="default"
                className="flex items-center justify-center gap-2"
                onClick={goHome}
              >
                <Home className="h-4 w-4" />
                Dashboard
              </Button>
              
              <Button 
                variant="secondary"
                className="flex items-center justify-center gap-2"
                onClick={goSearch}
              >
                <Search className="h-4 w-4" />
                Search Cases
              </Button>
            </div>
            
            <div className="mt-8 pt-6 border-t text-sm text-gray-500">
              <p>If you believe this is an error, please contact the system administrator.</p>
              <p className="mt-1">Error ID: {crypto.randomUUID().split('-')[0]}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
