
import { useState } from "react";
import { Conversation } from "./types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageSquare, Send, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MessageDetailProps {
  activeConversation: Conversation | null;
  onSendMessage: (conversationId: number, messageText: string) => void;
  onArchiveToggle: (conversation: Conversation) => void;
  onNewMessage: () => void;
}

const MessageDetail = ({
  activeConversation,
  onSendMessage,
  onArchiveToggle,
  onNewMessage,
}: MessageDetailProps) => {
  const { toast } = useToast();
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeConversation) return;
    
    onSendMessage(activeConversation.id, newMessage);
    setNewMessage("");
    
    toast({
      title: "Message sent",
      description: "Your message has been sent successfully",
    });
  };

  if (!activeConversation) {
    return (
      <Card className="h-[calc(100vh-12rem)]">
        <div className="flex flex-col items-center justify-center h-full p-4 text-center">
          <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="font-medium">No conversation selected</p>
          <p className="text-sm text-muted-foreground mt-1">
            Select a conversation from the list or start a new one
          </p>
          <Button 
            className="mt-4 flex items-center gap-2"
            onClick={onNewMessage}  
          >
            <Plus className="h-4 w-4" />
            New Message
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="h-[calc(100vh-12rem)]">
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
            onClick={() => onArchiveToggle(activeConversation)}
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
    </Card>
  );
};

export default MessageDetail;
