
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Conversation } from "./types";

interface NewMessageDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateConversation: (newConv: Conversation) => void;
}

const NewMessageDialog = ({
  isOpen,
  onOpenChange,
  onCreateConversation,
}: NewMessageDialogProps) => {
  const { toast } = useToast();
  const [newRecipient, setNewRecipient] = useState("");
  const [newInitialMessage, setNewInitialMessage] = useState("");

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
    
    onCreateConversation(newConv);
    setNewRecipient("");
    setNewInitialMessage("");
    onOpenChange(false);
    
    toast({
      title: "New conversation created",
      description: `Started conversation with ${newRecipient}`,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreateNewConversation}>
            Send Message
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewMessageDialog;
