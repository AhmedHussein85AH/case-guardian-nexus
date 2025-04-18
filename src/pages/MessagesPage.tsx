
import AppShell from "@/components/layouts/AppShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, Send, Plus, Inbox, Archive } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const MessagesPage = () => {
  // Mock message data
  const conversations = [
    {
      id: 1,
      user: "Jane Smith",
      lastMessage: "Can you update me on case #45671?",
      time: "10:23 AM",
      unread: true,
      userInitials: "JS"
    },
    {
      id: 2,
      user: "Robert Johnson",
      lastMessage: "Documents received for case #45892",
      time: "Yesterday",
      unread: false,
      userInitials: "RJ"
    },
    {
      id: 3,
      user: "Sarah Williams",
      lastMessage: "Meeting scheduled for tomorrow",
      time: "Yesterday",
      unread: false,
      userInitials: "SW"
    },
    {
      id: 4,
      user: "Michael Davis",
      lastMessage: "Please review the updated case notes",
      time: "Monday",
      unread: true,
      userInitials: "MD"
    },
    {
      id: 5,
      user: "Lisa Brown",
      lastMessage: "New evidence submitted for review",
      time: "Last week",
      unread: false,
      userInitials: "LB"
    },
  ];

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
            <p className="text-muted-foreground mt-2">
              Communicate with team members and clients
            </p>
          </div>
          
          <Button className="self-start flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Message
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-6">
          {/* Conversations list */}
          <Card className="h-[calc(100vh-12rem)]">
            <CardHeader className="p-4">
              <div className="flex items-center justify-between">
                <CardTitle>Conversations</CardTitle>
                <Badge>{conversations.filter(c => c.unread).length}</Badge>
              </div>
              <Input placeholder="Search messages..." className="mt-2" />
            </CardHeader>
            <CardContent className="p-0">
              <Tabs defaultValue="inbox">
                <TabsList className="grid grid-cols-2 w-full rounded-none border-b border-t">
                  <TabsTrigger value="inbox" className="flex items-center gap-2">
                    <Inbox className="h-4 w-4" />
                    Inbox
                  </TabsTrigger>
                  <TabsTrigger value="archived" className="flex items-center gap-2">
                    <Archive className="h-4 w-4" />
                    Archived
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="inbox" className="mt-0">
                  <ScrollArea className="h-[calc(100vh-16rem)]">
                    {conversations.map((conversation) => (
                      <div 
                        key={conversation.id} 
                        className={`p-4 border-b hover:bg-muted/50 cursor-pointer ${
                          conversation.unread ? 'bg-muted/30' : ''
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback>{conversation.userInitials}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="font-medium truncate">{conversation.user}</p>
                              <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                                {conversation.time}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground truncate">
                              {conversation.lastMessage}
                            </p>
                            {conversation.unread && (
                              <div className="flex justify-end">
                                <Badge variant="default" className="mt-1">New</Badge>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </ScrollArea>
                </TabsContent>
                <TabsContent value="archived" className="mt-0">
                  <div className="flex flex-col items-center justify-center h-[calc(100vh-16rem)] p-4 text-center">
                    <Archive className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="font-medium">No archived messages</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Archived conversations will appear here
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          {/* Message detail */}
          <Card className="h-[calc(100vh-12rem)]">
            <CardHeader className="border-b p-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback>JS</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">Jane Smith</CardTitle>
                  <CardDescription>Last active 5 minutes ago</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0 flex flex-col h-[calc(100vh-22rem)]">
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>JS</AvatarFallback>
                    </Avatar>
                    <div className="bg-muted p-3 rounded-lg max-w-[80%]">
                      <p className="text-sm">Hi, can you update me on case #45671? I need to prepare for the meeting tomorrow.</p>
                      <p className="text-xs text-muted-foreground mt-1">10:23 AM</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 justify-end">
                    <div className="bg-primary text-primary-foreground p-3 rounded-lg max-w-[80%]">
                      <p className="text-sm">Hello Jane, I'm working on the report now. I'll send it over in the next hour.</p>
                      <p className="text-xs text-primary-foreground/80 mt-1">10:27 AM</p>
                    </div>
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>ME</AvatarFallback>
                    </Avatar>
                  </div>
                  
                  <div className="flex gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>JS</AvatarFallback>
                    </Avatar>
                    <div className="bg-muted p-3 rounded-lg max-w-[80%]">
                      <p className="text-sm">Perfect, thank you! Also, did you receive the new documents from the client?</p>
                      <p className="text-xs text-muted-foreground mt-1">10:30 AM</p>
                    </div>
                  </div>
                </div>
              </ScrollArea>
              
              <div className="p-4 border-t mt-auto">
                <div className="flex gap-2">
                  <Input placeholder="Type your message..." className="flex-1" />
                  <Button size="icon">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
};

export default MessagesPage;
