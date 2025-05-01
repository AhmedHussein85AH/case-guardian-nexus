
import { Conversation } from "./types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Inbox, Archive, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useState } from "react";

interface ConversationsListProps {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  onConversationSelect: (conversation: Conversation) => void;
  onNewMessage: () => void;
  onShowArchived: (showArchived: boolean) => void;
  showingArchived: boolean;
}

const ConversationsList = ({
  conversations,
  activeConversation,
  onConversationSelect,
  onNewMessage,
  onShowArchived,
  showingArchived
}: ConversationsListProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filter conversations based on archived status and search query
  const filteredConversations = conversations
    .filter(c => c.archived === showingArchived)
    .filter(c => c.user.toLowerCase().includes(searchQuery.toLowerCase()) || 
                c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()));
  
  return (
    <Card className="h-[calc(100vh-12rem)]">
      <CardHeader className="p-4">
        <div className="flex items-center justify-between">
          <CardTitle>Conversations</CardTitle>
          <Badge>{conversations.filter(c => c.unread).length}</Badge>
        </div>
        <Input 
          placeholder="Search messages..." 
          className="mt-2" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </CardHeader>
      <CardContent className="p-0">
        <Tabs 
          defaultValue={showingArchived ? "archived" : "inbox"}
          onValueChange={(value) => onShowArchived(value === "archived")}
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
                    onClick={() => onConversationSelect(conversation)}
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
                    onClick={() => onConversationSelect(conversation)}
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
  );
};

export default ConversationsList;
