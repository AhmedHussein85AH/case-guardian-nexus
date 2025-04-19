
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import AppShell from "@/components/layouts/AppShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Filter } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

const NotificationsPage = () => {
  const [searchParams] = useSearchParams();
  const selectedId = searchParams.get("id") ? parseInt(searchParams.get("id")!) : null;
  const [activeTab, setActiveTab] = useState("all");
  const { toast } = useToast();
  
  // Mock notifications data
  const notifications = [
    {
      id: 1,
      title: "New case assigned",
      description: "Case #12345 has been assigned to you",
      time: "5 minutes ago",
      isRead: false,
      type: "case"
    },
    {
      id: 2,
      title: "High priority case updated",
      description: "Case #12342 has been updated with new evidence",
      time: "1 hour ago",
      isRead: false,
      type: "case"
    },
    {
      id: 3,
      title: "System update",
      description: "New features have been added to the system",
      time: "1 day ago",
      isRead: true,
      type: "system"
    },
    {
      id: 4,
      title: "New message from Sarah Williams",
      description: "Have you reviewed the latest evidence for case #12342?",
      time: "2 days ago",
      isRead: true,
      type: "message"
    },
    {
      id: 5,
      title: "Cases report ready",
      description: "Monthly cases report is now available",
      time: "3 days ago",
      isRead: true,
      type: "report"
    }
  ];

  useEffect(() => {
    if (selectedId) {
      const notification = notifications.find(n => n.id === selectedId);
      if (notification) {
        // Switch to the appropriate tab based on notification type
        setActiveTab(notification.type !== "report" ? notification.type : "all");
        
        toast({
          title: "Notification selected",
          description: `Viewing: ${notification.title}`,
        });
      }
    }
  }, [selectedId, toast]);

  const markAllAsRead = () => {
    toast({
      title: "Success",
      description: "All notifications marked as read",
    });
  };

  const clearAll = () => {
    toast({
      title: "Success",
      description: "All notifications cleared",
    });
  };

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
            <p className="text-muted-foreground mt-2">
              View and manage your notifications
            </p>
          </div>
          
          <div className="flex gap-2 self-start">
            <Button variant="outline" onClick={markAllAsRead}>Mark all as read</Button>
            <Button variant="outline" className="text-destructive hover:text-destructive" onClick={clearAll}>
              Clear all
            </Button>
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
              <div>
                <CardTitle>All Notifications</CardTitle>
                <CardDescription>
                  You have {notifications.filter(n => !n.isRead).length} unread notifications
                </CardDescription>
              </div>
              
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search notifications..." 
                    className="pl-8 w-[200px] md:w-[250px]"
                  />
                </div>
                
                <Button variant="outline" size="icon" className="h-10 w-10">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-4 h-auto">
                <TabsTrigger value="all" className="py-2">
                  All
                </TabsTrigger>
                <TabsTrigger value="case" className="py-2">
                  Cases
                </TabsTrigger>
                <TabsTrigger value="message" className="py-2">
                  Messages
                </TabsTrigger>
                <TabsTrigger value="system" className="py-2">
                  System
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="space-y-4">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Notification</TableHead>
                        <TableHead className="w-[150px]">Time</TableHead>
                        <TableHead className="w-[100px]">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {notifications.map((notification) => (
                        <TableRow 
                          key={notification.id} 
                          className={selectedId === notification.id ? "bg-blue-50 dark:bg-blue-900/20" : ""}
                        >
                          <TableCell>
                            <div className="flex flex-col space-y-1">
                              <p className="font-medium">{notification.title}</p>
                              <p className="text-sm text-muted-foreground">{notification.description}</p>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {notification.time}
                          </TableCell>
                          <TableCell>
                            {notification.isRead ? (
                              <Badge variant="outline" className="bg-gray-100 text-gray-500 border-gray-200">Read</Badge>
                            ) : (
                              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Unread</Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
              
              <TabsContent value="case" className="space-y-4">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Notification</TableHead>
                        <TableHead className="w-[150px]">Time</TableHead>
                        <TableHead className="w-[100px]">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {notifications.filter(n => n.type === 'case').map((notification) => (
                        <TableRow 
                          key={notification.id}
                          className={selectedId === notification.id ? "bg-blue-50 dark:bg-blue-900/20" : ""}
                        >
                          <TableCell>
                            <div className="flex flex-col space-y-1">
                              <p className="font-medium">{notification.title}</p>
                              <p className="text-sm text-muted-foreground">{notification.description}</p>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {notification.time}
                          </TableCell>
                          <TableCell>
                            {notification.isRead ? (
                              <Badge variant="outline" className="bg-gray-100 text-gray-500 border-gray-200">Read</Badge>
                            ) : (
                              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Unread</Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
              
              <TabsContent value="message" className="space-y-4">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Notification</TableHead>
                        <TableHead className="w-[150px]">Time</TableHead>
                        <TableHead className="w-[100px]">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {notifications.filter(n => n.type === 'message').map((notification) => (
                        <TableRow 
                          key={notification.id}
                          className={selectedId === notification.id ? "bg-blue-50 dark:bg-blue-900/20" : ""}
                        >
                          <TableCell>
                            <div className="flex flex-col space-y-1">
                              <p className="font-medium">{notification.title}</p>
                              <p className="text-sm text-muted-foreground">{notification.description}</p>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {notification.time}
                          </TableCell>
                          <TableCell>
                            {notification.isRead ? (
                              <Badge variant="outline" className="bg-gray-100 text-gray-500 border-gray-200">Read</Badge>
                            ) : (
                              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Unread</Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
              
              <TabsContent value="system" className="space-y-4">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Notification</TableHead>
                        <TableHead className="w-[150px]">Time</TableHead>
                        <TableHead className="w-[100px]">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {notifications.filter(n => n.type === 'system').map((notification) => (
                        <TableRow 
                          key={notification.id}
                          className={selectedId === notification.id ? "bg-blue-50 dark:bg-blue-900/20" : ""}
                        >
                          <TableCell>
                            <div className="flex flex-col space-y-1">
                              <p className="font-medium">{notification.title}</p>
                              <p className="text-sm text-muted-foreground">{notification.description}</p>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {notification.time}
                          </TableCell>
                          <TableCell>
                            {notification.isRead ? (
                              <Badge variant="outline" className="bg-gray-100 text-gray-500 border-gray-200">Read</Badge>
                            ) : (
                              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Unread</Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
};

export default NotificationsPage;
