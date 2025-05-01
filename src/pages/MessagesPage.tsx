
import { useState } from "react";
import AppShell from "@/components/layouts/AppShell";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import ConversationsList from "@/components/messages/ConversationsList";
import MessageDetail from "@/components/messages/MessageDetail";
import NewMessageDialog from "@/components/messages/NewMessageDialog";
import { useConversations } from "@/components/messages/useConversations";

const MessagesPage = () => {
  const [isNewMessageDialogOpen, setIsNewMessageDialogOpen] = useState(false);
  
  const {
    conversations,
    activeConversation,
    showingArchived,
    setShowingArchived,
    handleConversationSelect,
    handleSendMessage,
    handleArchiveToggle,
    handleCreateConversation
  } = useConversations();
  
  // Function to handle creating a new message
  const handleNewMessage = () => {
    setIsNewMessageDialogOpen(true);
  };

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
          <ConversationsList
            conversations={conversations}
            activeConversation={activeConversation}
            onConversationSelect={handleConversationSelect}
            onNewMessage={handleNewMessage}
            onShowArchived={setShowingArchived}
            showingArchived={showingArchived}
          />
          
          {/* Message detail */}
          <MessageDetail
            activeConversation={activeConversation}
            onSendMessage={handleSendMessage}
            onArchiveToggle={handleArchiveToggle}
            onNewMessage={handleNewMessage}
          />
        </div>
      </div>
      
      {/* New Message Dialog */}
      <NewMessageDialog
        isOpen={isNewMessageDialogOpen}
        onOpenChange={setIsNewMessageDialogOpen}
        onCreateConversation={handleCreateConversation}
      />
    </AppShell>
  );
};

export default MessagesPage;
