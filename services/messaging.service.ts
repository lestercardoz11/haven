// src/services/messaging.service.ts

import { ApiResponse } from '@/types/common.types';
import { Conversation, Message, SendMessageData } from '@/types/message.types';
import { supabase } from './supabase';

class MessagingService {
  /**
   * Get conversations for a user
   */
  async getConversations(userId: string): Promise<ApiResponse<Conversation[]>> {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select(
          `
          *,
          participant_1:profiles!conversations_participant_1_id_fkey(*),
          participant_2:profiles!conversations_participant_2_id_fkey(*)
        `
        )
        .or(`participant_1_id.eq.${userId},participant_2_id.eq.${userId}`)
        .order('last_message_at', { ascending: false });

      if (error) {
        return { success: false, error: error.message };
      }

      // Format conversations with other participant info
      const conversations: Conversation[] = data.map((conv) => {
        const otherParticipant =
          conv.participant_1_id === userId
            ? conv.participant_2
            : conv.participant_1;

        return {
          ...conv,
          other_participant: otherParticipant,
        };
      });

      // Get unread counts for each conversation
      for (const conv of conversations) {
        const { count } = await supabase
          .from('messages')
          .select('*', { count: 'exact', head: true })
          .eq('conversation_id', conv.id)
          .eq('receiver_id', userId)
          .eq('is_read', false);

        conv.unread_count = count || 0;
      }

      return { success: true, data: conversations };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Get messages for a conversation
   */
  async getMessages(conversationId: string): Promise<ApiResponse<Message[]>> {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(
          `
          *,
          sender:profiles!messages_sender_id_fkey(*)
        `
        )
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data: data || [] };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Send a message
   */
  async sendMessage(
    messageData: SendMessageData,
    senderId: string
  ): Promise<ApiResponse<Message>> {
    try {
      // Create message
      const { data: message, error: messageError } = await supabase
        .from('messages')
        .insert({
          conversation_id: messageData.conversation_id,
          sender_id: senderId,
          receiver_id: messageData.receiver_id,
          message_text: messageData.message_text,
          message_type: messageData.message_type || 'text',
          image_url: messageData.image_url,
        })
        .select(
          `
          *,
          sender:profiles!messages_sender_id_fkey(*)
        `
        )
        .single();

      if (messageError) {
        return { success: false, error: messageError.message };
      }

      // Update conversation last message
      await supabase
        .from('conversations')
        .update({
          last_message_at: new Date().toISOString(),
          last_message_preview: messageData.message_text.substring(0, 100),
        })
        .eq('id', messageData.conversation_id);

      return { success: true, data: message };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Mark messages as read
   */
  async markAsRead(
    conversationId: string,
    userId: string
  ): Promise<ApiResponse<void>> {
    try {
      const { error } = await supabase
        .from('messages')
        .update({
          is_read: true,
          read_at: new Date().toISOString(),
        })
        .eq('conversation_id', conversationId)
        .eq('receiver_id', userId)
        .eq('is_read', false);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Subscribe to new messages in a conversation
   */
  subscribeToMessages(
    conversationId: string,
    callback: (message: Message) => void
  ) {
    return supabase
      .channel(`messages:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        async (payload) => {
          // Fetch full message with sender info
          const { data } = await supabase
            .from('messages')
            .select(
              `
              *,
              sender:profiles!messages_sender_id_fkey(*)
            `
            )
            .eq('id', payload.new.id)
            .single();

          if (data) {
            callback(data);
          }
        }
      )
      .subscribe();
  }

  /**
   * Unsubscribe from messages
   */
  async unsubscribeFromMessages(conversationId: string) {
    const channel = supabase.channel(`messages:${conversationId}`);
    await supabase.removeChannel(channel);
  }

  /**
   * Get unread message count
   */
  async getUnreadCount(userId: string): Promise<ApiResponse<number>> {
    try {
      const { count, error } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('receiver_id', userId)
        .eq('is_read', false);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data: count || 0 };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Search conversations
   */
  async searchConversations(
    userId: string,
    searchQuery: string
  ): Promise<ApiResponse<Conversation[]>> {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select(
          `
          *,
          participant_1:profiles!conversations_participant_1_id_fkey(*),
          participant_2:profiles!conversations_participant_2_id_fkey(*)
        `
        )
        .or(`participant_1_id.eq.${userId},participant_2_id.eq.${userId}`);

      if (error) {
        return { success: false, error: error.message };
      }

      // Filter conversations where other participant's name matches search
      const filtered = data.filter((conv) => {
        const otherParticipant =
          conv.participant_1_id === userId
            ? conv.participant_2
            : conv.participant_1;

        return otherParticipant.full_name
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
      });

      const conversations: Conversation[] = filtered.map((conv) => ({
        ...conv,
        other_participant:
          conv.participant_1_id === userId
            ? conv.participant_2
            : conv.participant_1,
      }));

      return { success: true, data: conversations };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
}

export const messagingService = new MessagingService();
