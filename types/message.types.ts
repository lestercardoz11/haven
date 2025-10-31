import { MessageType, User } from './user.types';

// src/types/message.types.ts
export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  receiver_id: string;
  message_text: string;
  message_type: MessageType;
  image_url?: string;
  is_read: boolean;
  read_at?: string;
  created_at: string;
  sender?: User;
}

export interface Conversation {
  id: string;
  participant_1_id: string;
  participant_2_id: string;
  last_message_at: string;
  last_message_preview?: string;
  created_at: string;
  other_participant?: User;
  unread_count?: number;
}

export interface SendMessageData {
  conversation_id: string;
  receiver_id: string;
  message_text: string;
  message_type?: MessageType;
  image_url?: string;
}
