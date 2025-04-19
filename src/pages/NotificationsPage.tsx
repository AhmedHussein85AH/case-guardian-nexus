
import AppShell from "@/components/layouts/AppShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, CheckCheck, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { 
  Notification, 
  deleteNotification, 
  getAllNotifications, 
  markAllNotificationsAsRead, 
  markNotificationAsRead 
} from "@/services/dataService";
import { useToast } from "@/hooks/use-toast";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [searchParams] = useSearchParams();
  const highlightedId = searchParams.get('id') ? Number(searchParams.get('id')) : null;
  const { toast } = useToast();
  
  useEffect(() => {
    loadNotifications();
    
    // If there's a highlighted notification, mark it as read
    if (highlightedId) {
      markNotificationAsRead(highlightedId);
    }
    
    // Listen for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "case-guardian-notifications") {
        loadNotifications();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [highlightedId]);
  
  const loadNotifications = () => {
    const allNotifications = getAllNotifications();
    setNotifications(allNotifications);
  };
  
  const handleMarkAllAsRead = () => {
    markAllNotificationsAsRead();
    loadNotifications();
    toast({
      title: "Success",
      description: "All notifications marked as read",
    });
  };
  
  const handleDeleteNotification = (id: number) => {
    deleteNotification(id);
    loadNotifications();
    toast({
      title: "Notification deleted",
      description: "The notification has been removed",
    });
  };
  
  const handleMarkAsRead = (id: number) => {
    markNotificationAsRead(id);
    loadNotifications();
    toast({
      title: "Notification marked as read",
      description: "The notification has been marked as read",
    });
  };
  
  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
            <p className="text-muted-foreground mt-2">
              Stay updated with important events and updates
            </p>
          </div>
          
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={handleMarkAllAsRead}
            disabled={notifications.every(n => n.read)}
          >
            <CheckCheck className="h-4 w-4" />
            Mark all as read
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>All Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No notifications</h3>
                <p className="text-muted-foreground mt-1">
                  You don't have any notifications at the moment
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div 
                    key={notification.id} 
                    className={`
                      p-4 border rounded-lg
                      ${notification.read ? 'bg-card' : 'bg-muted/30'}
                      ${highlightedId === notification.id ? 'ring-2 ring-primary' : ''}
                      transition-all
                    `}
                    id={`notification-${notification.id}`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{notification.title}</h3>
                        <p className="text-muted-foreground text-sm mt-1">
                          {notification.description}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {notification.time}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        {!notification.read && (
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleMarkAsRead(notification.id)}
                            title="Mark as read"
                          >
                            <CheckCheck className="h-4 w-4" />
                          </Button>
                        )}
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDeleteNotification(notification.id)}
                          title="Delete notification"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
};

export default NotificationsPage;
