
import { useToast } from "@/hooks/use-toast";

export const useUserNotifications = () => {
  const { toast } = useToast();

  const showToast = (title: string, description: string) => {
    toast({ title, description });
  };

  return {
    showToast
  };
};
