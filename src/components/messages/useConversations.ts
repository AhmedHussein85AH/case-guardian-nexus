
import { useState, useEffect } from "react";
import { Conversation, Message } from "./types";
import { useToast } from "@/hooks/use-toast";

export const useConversations = () => {
  const { toast } = useToast();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
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
  const handleSendMessage = (conversationId: number, messageText: string) => {
    if (!messageText.trim() || !activeConversation) return;
    
    const now = new Date();
    const currentTime = now.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true
    });
    
    // Create new message
    const message: Message = {
      id: Date.now(),
      text: messageText,
      sender: "Me",
      time: currentTime,
      isMe: true
    };
    
    // Find the conversation to update
    const conversationToUpdate = conversations.find(c => c.id === conversationId);
    if (!conversationToUpdate) return;
    
    // Update conversation with new message
    const updatedConversation = {
      ...conversationToUpdate,
      messages: [...conversationToUpdate.messages, message],
      lastMessage: messageText,
      time: currentTime
    };
    
    // Update all conversations
    const updatedConversations = conversations.map(c => 
      c.id === conversationId ? updatedConversation : c
    );
    
    setActiveConversation(updatedConversation);
    setConversations(updatedConversations);
    localStorage.setItem('case-guardian-conversations', JSON.stringify(updatedConversations));
  };

  // Function to handle archiving/unarchiving a conversation
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

  // Function to create a new conversation
  const handleCreateConversation = (newConversation: Conversation) => {
    // Update conversations
    const updatedConversations = [newConversation, ...conversations];
    setConversations(updatedConversations);
    setActiveConversation(newConversation);
    localStorage.setItem('case-guardian-conversations', JSON.stringify(updatedConversations));
  };

  return {
    conversations,
    activeConversation,
    showingArchived,
    setShowingArchived,
    handleConversationSelect,
    handleSendMessage,
    handleArchiveToggle,
    handleCreateConversation
  };
};
