
export type Message = {
  id: number;
  text: string;
  sender: string;
  time: string;
  isMe: boolean;
};

export type Conversation = {
  id: number;
  user: string;
  lastMessage: string;
  time: string;
  unread: boolean;
  userInitials: string;
  messages: Message[];
  archived: boolean;
};
