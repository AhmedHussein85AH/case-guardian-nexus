
import { useState, useEffect } from "react";
import AppShell from "@/components/layouts/AppShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, Send, Plus, Inbox, Archive } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";

type Message = {
  id: number;
  text: string;
  sender: string;
  time: string;
  isMe: boolean;
};

type Conversation = {
  id: number;
  user: string;
  lastMessage: string;
  time: string;
  unread: boolean;
  userInitials: string;
  messages: Message[];
  archived: boolean;
};

const MessagesPage = () => {
  const { toast } = useToast();
  const [isNewMessageDialogOpen, setIsNewMessageDialogOpen] = useState(false);
  const [newRecipient, setNewRecipient] = useState("");
  const [newInitialMessage, setNewInitialMessage] = useState("");
  
  // State to store messages
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [showingArchived, setShowingArchived] = useState(false);
  
  // Initialize with mock data or load from localStorage
  useEffect(() => {
    const storedConversations = localStorage.getItem('case-guardian-conversations');
    
    if (storedConversations) {
      const parsedConversations = JSON.parse(storedConversations);
      setConversations(parsedConversations);
      if (parsedConversations.length > 0) {
        setActiveConversation(parsedConversations[0]);
      }
    } else {
      // Mock conversation data
      const mockConversations: Conversation[] = [
        {
          id: 1,
          user: "Jane Smith",
          lastMessage: "Can you update me on case #45671?",
          time: "10:23 AM",
          unread: true,
          userInitials: "JS",
          messages: [
            { id: 1, text: "Can you update me on case #45671?", sender: "Jane Smith", time: "10:23 AM", isMe: false }
          ],
          archived: false
        },
        {
          id: 2,
          user: "Robert Johnson",
          lastMessage: "Documents received for case #45892",
          time: "Yesterday",
          unread: false,
          userInitials: "RJ",
          messages: [
            { id: 1, text: "Documents received for case #45892", sender: "Robert Johnson", time: "Yesterday", isMe: false },
            { id: 2, text: "Thanks Robert, I'll take a look at them soon", sender: "Me", time: "Yesterday", isMe: true }
          ],
          archived: false
        },
        {
          id: 3,
          user: "Sarah Williams",
          lastMessage: "Meeting scheduled for tomorrow",
          time: "Yesterday",
          unread: false,
          userInitials: "SW",
          messages: [
            { id: 1, text: "Meeting scheduled for tomorrow", sender: "Sarah Williams", time: "Yesterday", isMe: false },
            { id: 2, text: "I'll be there on time", sender: "Me", time: "Yesterday", isMe: true }
          ],
          archived: false
        },
        {
          id: 4,
          user: "Michael Davis",
          lastMessage: "Please review the updated case notes",
          time: "Monday",
          unread: true,
          userInitials: "MD",
          messages: [
            { id: 1, text: "Please review the updated case notes", sender: "Michael Davis", time: "Monday", isMe: false }
          ],
          archived: false
        },
        {
          id: 5,
          user: "Lisa Brown",
          lastMessage: "New evidence submitted for review",
          time: "Last week",
          unread: false,
          userInitials: "LB",
          messages: [
            { id: 1, text: "New evidence submitted for review", sender: "Lisa Brown", time: "Last week", isMe: false },
            { id: 2, text: "I'll check it out", sender: "Me", time: "Last week", isMe: true }
          ],
          archived: false
        },
      ];
      
      setConversations(mockConversations);
      setActiveConversation(mockConversations[0]);
      localStorage.setItem('case-guardian-conversations', JSON.stringify(mockConversations));
    }
  }, []);
  
  // Function to handle conversation selection
  const handleConversationSelect = (conversation: Conversation) => {
    // Mark as read when clicked
    const updatedConversations = conversations.map(c => {
      if (c.id === conversation.id) {
        return { ...c, unread: false };
      }
      return c;
    });
    
    setConversations(updatedConversations);
    localStorage.setItem('case-guardian-conversations', JSON.stringify(updatedConversations));
    
    const updatedConversation = { ...conversation, unread: false };
    setActiveConversation(updatedConversation);
    
    // Show toast notification
    toast({
      title: "Conversation opened",
      description: `Opened conversation with ${conversation.user}`,
    });
  };

  // Function to handle sending a new message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeConversation) return;
    
    const now = new Date();
    const currentTime = now.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true
    });
    
    // Create new message
    const message: Message = {
      id: Date.now(),
      text: newMessage,
      sender: "Me",
      time: currentTime,
      isMe: true
    };
    
    // Update active conversation
    const updatedActiveConversation = {
      ...activeConversation,
      messages: [...activeConversation.messages, message],
      lastMessage: newMessage,
      time: currentTime
    };
    
    // Update all conversations
    const updatedConversations = conversations.map(c => 
      c.id === activeConversation.id ? updatedActiveConversation : c
    );
    
    setActiveConversation(updatedActiveConversation);
    setConversations(updatedConversations);
    localStorage.setItem('case-guardian-conversations', JSON.stringify(updatedConversations));
    
    toast({
      title: "Message sent",
      description: "Your message has been sent successfully",
    });
    
    setNewMessage("");
  };

  // Function to handle creating a new message
  const handleNewMessage = () => {
    setIsNewMessageDialogOpen(true);
  };
  
  // Function to handle submitting a new conversation
  const handleCreateNewConversation = () => {
    if (!newRecipient.trim() || !newInitialMessage.trim()) {
      toast({
        title: "Error",
        description: "Please enter both recipient name and message",
        variant: "destructive"
      });
      return;
    }
    
    // Generate initials
    const initials = newRecipient
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
      
    const now = new Date();
    const currentTime = now.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true
    });
    
    // Create new conversation
    const newConv: Conversation = {
      id: Date.now(),
      user: newRecipient,
      lastMessage: newInitialMessage,
      time: currentTime,
      unread: false,
      userInitials: initials,
      messages: [
        { 
          id: Date.now(), 
          text: newInitialMessage, 
          sender: "Me", 
          time: currentTime,
          isMe: true
        }
      ],
      archived: false
    };
    
    // Update conversations
    const updatedConversations = [newConv, ...conversations];
    setConversations(updatedConversations);
    setActiveConversation(newConv);
    localStorage.setItem('case-guardian-conversations', JSON.stringify(updatedConversations));
    
    // Reset form and close dialog
    setNewRecipient("");
    setNewInitialMessage("");
    setIsNewMessageDialogOpen(false);
    
    toast({
      title: "New conversation created",
      description: `Started conversation with ${newRecipient}`,
    });
  };

  // Function to archive/unarchive conversation
  const handleArchiveToggle = (conversation: Conversation) => {
    const updatedConversations = conversations.map(c => 
      c.id === conversation.id ? { ...c, archived: !c.archived } : c
    );
    
    setConversations(updatedConversations);
    localStorage.setItem('case-guardian-conversations', JSON.stringify(updatedConversations));
    
    toast({
      title: conversation.archived ? "Conversation unarchived" : "Conversation archived",
      description: `${conversation.archived ? "Moved to inbox" : "Moved to archive"}: ${conversation.user}`,
    });
    
    // If active conversation is archived and viewing inbox, select another conversation
    if (activeConversation?.id === conversation.id && !showingArchived && !conversation.archived) {
      const firstInbox = updatedConversations.find(c => !c.archived);
      if (firstInbox) {
        setActiveConversation(firstInbox);
      } else {
        setActiveConversation(null);
      }
    }
  };
  
  // Filter conversations based on archived status
  const filteredConversations = conversations.filter(c => c.archived === showingArchived);

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
          
          <Button 
            className="self-start flex items-center gap-2"
            onClick={handleNewMessage}  
          >
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
              <Tabs 
                defaultValue="inbox" 
                onValueChange={(value) => setShowingArchived(value === "archived")}
              >
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
                    {filteredConversations.length > 0 ? (
                      filteredConversations.map((conversation) => (
                        <div 
                          key={conversation.id} 
                          className={`p-4 border-b hover:bg-muted/50 cursor-pointer ${
                            conversation.unread ? 'bg-muted/30' : ''
                          } ${activeConversation?.id === conversation.id ? 'bg-muted' : ''}`}
                          onClick={() => handleConversationSelect(conversation)}
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
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center h-[calc(100vh-16rem)] p-4 text-center">
                        <Inbox className="h-12 w-12 text-muted-foreground mb-4" />
                        <p className="font-medium">No messages in inbox</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Start a new conversation using the "New Message" button
                        </p>
                      </div>
                    )}
                  </ScrollArea>
                </TabsContent>
                <TabsContent value="archived" className="mt-0">
                  <ScrollArea className="h-[calc(100vh-16rem)]">
                    {filteredConversations.length > 0 ? (
                      filteredConversations.map((conversation) => (
                        <div 
                          key={conversation.id} 
                          className={`p-4 border-b hover:bg-muted/50 cursor-pointer ${
                            conversation.unread ? 'bg-muted/30' : ''
                          } ${activeConversation?.id === conversation.id ? 'bg-muted' : ''}`}
                          onClick={() => handleConversationSelect(conversation)}
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
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center h-[calc(100vh-16rem)] p-4 text-center">
                        <Archive className="h-12 w-12 text-muted-foreground mb-4" />
                        <p className="font-medium">No archived messages</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Archived conversations will appear here
                        </p>
                      </div>
                    )}
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          {/* Message detail */}
          <Card className="h-[calc(100vh-12rem)]">
            {activeConversation ? (
              <>
                <CardHeader className="border-b p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>{activeConversation.userInitials}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{activeConversation.user}</CardTitle>
                        <CardDescription>Last active 5 minutes ago</CardDescription>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleArchiveToggle(activeConversation)}
                    >
                      {activeConversation.archived ? "Unarchive" : "Archive"}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0 flex flex-col h-[calc(100vh-22rem)]">
                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                      {activeConversation.messages.map((msg) => (
                        <div key={msg.id} className={`flex gap-3 ${msg.isMe ? 'justify-end' : ''}`}>
                          {!msg.isMe && (
                            <Avatar className="h-10 w-10">
                              <AvatarFallback>{activeConversation.userInitials}</AvatarFallback>
                            </Avatar>
                          )}
                          <div className={`${
                            msg.isMe 
                              ? 'bg-primary text-primary-foreground' 
                              : 'bg-muted'
                            } p-3 rounded-lg max-w-[80%]`}
                          >
                            <p className="text-sm">{msg.text}</p>
                            <p className={`text-xs ${
                              msg.isMe ? 'text-primary-foreground/80' : 'text-muted-foreground'
                            } mt-1`}>
                              {msg.time}
                            </p>
                          </div>
                          {msg.isMe && (
                            <Avatar className="h-10 w-10">
                              <AvatarFallback>ME</AvatarFallback>
                            </Avatar>
                          )}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                  
                  <div className="p-4 border-t mt-auto">
                    <form onSubmit={handleSendMessage} className="flex gap-2">
                      <Input 
                        placeholder="Type your message..." 
                        className="flex-1"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                      />
                      <Button type="submit" size="icon">
                        <Send className="h-4 w-4" />
                      </Button>
                    </form>
                  </div>
                </CardContent>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="font-medium">No conversation selected</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Select a conversation from the list or start a new one
                </p>
                <Button 
                  className="mt-4 flex items-center gap-2"
                  onClick={handleNewMessage}  
                >
                  <Plus className="h-4 w-4" />
                  New Message
                </Button>
              </div>
            )}
          </Card>
        </div>
      </div>
      
      {/* New Message Dialog */}
      <Dialog open={isNewMessageDialogOpen} onOpenChange={setIsNewMessageDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>New Message</DialogTitle>
            <DialogDescription>
              Create a new conversation with a team member or client.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="recipient" className="text-sm font-medium">
                Recipient Name
              </label>
              <Input
                id="recipient"
                placeholder="Enter recipient name"
                value={newRecipient}
                onChange={(e) => setNewRecipient(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="message" className="text-sm font-medium">
                Message
              </label>
              <Input
                id="message"
                placeholder="Type your message"
                value={newInitialMessage}
                onChange={(e) => setNewInitialMessage(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewMessageDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateNewConversation}>
              Send Message
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
};

export default MessagesPage;
