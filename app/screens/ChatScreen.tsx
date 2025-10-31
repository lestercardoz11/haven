// src/screens/ChatScreen.tsx
import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../hooks/useAuth';
import { messagingService } from '../services/messaging.service';
import { Message } from '../types/message.types';

export const ChatScreen = ({ route, navigation }: any) => {
  const { conversationId, otherUserId } = route.params;
  const { theme } = useTheme();
  const { user } = useAuth();

  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState('');
  const [otherUser, setOtherUser] = useState<any>(null);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    loadMessages();
    messagingService.subscribeToMessages(conversationId, handleNewMessage);

    return () => {
      messagingService.unsubscribeFromMessages(conversationId);
    };
  }, [conversationId, loadMessages, handleNewMessage]);

  const loadMessages = useCallback(async () => {
    const result = await messagingService.getMessages(conversationId);
    if (result.success && result.data) {
      setMessages(result.data);
      if (result.data.length > 0) {
        setOtherUser(
          result.data[0].sender?.id === user!.id
            ? null
            : result.data[0].sender
        );
      }
    }

    // Mark as read
    await messagingService.markAsRead(conversationId, user!.id);
  }, [conversationId, user]);

  const handleNewMessage = useCallback((message: Message) => {
    setMessages((prev) => [...prev, message]);
    flatListRef.current?.scrollToEnd({ animated: true });
  }, []);

  const sendMessage = async () => {
    if (!messageText.trim()) return;

    const result = await messagingService.sendMessage(
      {
        conversation_id: conversationId,
        receiver_id: otherUserId,
        message_text: messageText,
      },
      user!.id
    );

    if (result.success) {
      setMessageText('');
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isMine = item.sender_id === user!.id;

    return (
      <View
        style={[styles.messageContainer, isMine && styles.myMessageContainer]}>
        {!isMine && (
          <Image
            source={{
              uri:
                item.sender?.profile_photo_url ||
                'https://via.placeholder.com/32',
            }}
            style={styles.messageAvatar}
          />
        )}
        <View
          style={[
            styles.messageBubble,
            {
              backgroundColor: isMine
                ? theme.colors.primary
                : theme.colors.border,
            },
          ]}>
          <Text
            style={[
              styles.messageText,
              { color: isMine ? '#ffffff' : theme.colors.text },
            ]}>
            {item.message_text}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Ionicons name='arrow-back' size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={[styles.headerName, { color: theme.colors.text }]}>
            {otherUser?.full_name || 'Chat'}
          </Text>
          <Text style={[styles.headerStatus, { color: theme.colors.success }]}>
            Active now
          </Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons
              name='videocam-outline'
              size={24}
              color={theme.colors.text}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons
              name='ellipsis-vertical'
              size={24}
              color={theme.colors.text}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Safety Banner */}
      <View
        style={[
          styles.safetyBanner,
          { backgroundColor: `${theme.colors.primary}10` },
        ]}>
        <Ionicons
          name='shield-checkmark'
          size={20}
          color={theme.colors.primary}
        />
        <Text style={[styles.safetyText, { color: theme.colors.text }]}>
          Never share personal financial information. Stay safe!
        </Text>
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesList}
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({ animated: false })
        }
      />

      {/* Input */}
      <View
        style={[
          styles.inputContainer,
          { backgroundColor: theme.colors.background },
        ]}>
        <TouchableOpacity style={styles.inputButton}>
          <Ionicons
            name='happy-outline'
            size={24}
            color={theme.colors.textMuted}
          />
        </TouchableOpacity>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: `${theme.colors.border}40`,
              color: theme.colors.text,
            },
          ]}
          placeholder='Type a message...'
          placeholderTextColor={theme.colors.textMuted}
          value={messageText}
          onChangeText={setMessageText}
          multiline
        />
        <TouchableOpacity style={styles.inputButton}>
          <Ionicons name='attach' size={24} color={theme.colors.textMuted} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.sendButton, { backgroundColor: theme.colors.primary }]}
          onPress={sendMessage}>
          <Ionicons name='send' size={20} color='#ffffff' />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  // Chat Screen
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 60,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
  },
  headerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  headerName: {
    fontSize: 16,
    fontWeight: '700',
  },
  headerStatus: {
    fontSize: 12,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    padding: 8,
  },
  safetyBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 8,
  },
  safetyText: {
    fontSize: 12,
    flex: 1,
  },
  messagesList: {
    padding: 16,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-end',
  },
  myMessageContainer: {
    justifyContent: 'flex-end',
  },
  messageAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  messageBubble: {
    maxWidth: '70%',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  messageText: {
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 8,
  },
  inputButton: {
    padding: 8,
  },
  input: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Profile Screen
  profileSection: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  photoContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profilePhoto: {
    width: 128,
    height: 128,
    borderRadius: 64,
  },
  editPhotoButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileName: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
  },
  profileLocation: {
    fontSize: 16,
  },
  verificationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginHorizontal: 16,
  },
  verificationText: {
    fontSize: 14,
    fontWeight: '600',
  },
  progressSection: {
    alignItems: 'center',
    padding: 24,
  },
  progressCircle: {
    alignItems: 'center',
    marginBottom: 12,
  },
  progressPercent: {
    fontSize: 32,
    fontWeight: '700',
  },
  progressLabel: {
    fontSize: 14,
  },
  progressHint: {
    fontSize: 12,
  },
  actionsGrid: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  actionCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 8,
  },
  actionSubtitle: {
    fontSize: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 24,
    borderWidth: 1,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 12,
  },
  statDivider: {
    width: 1,
    height: 48,
  },
  menuSection: {
    paddingHorizontal: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '600',
  },
  // Profile Detail Screen
  imageContainer: {
    position: 'relative',
    height: 400,
  },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  floatingActions: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  floatingButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  floatingRight: {
    flexDirection: 'row',
    gap: 8,
  },
  profileCard: {
    marginTop: -64,
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(76, 217, 100, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  verifiedText: {
    fontSize: 12,
    color: '#4CD964',
    fontWeight: '600',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 16,
  },
  infoText: {
    fontSize: 14,
  },
  quickStats: {
    flexDirection: 'row',
    gap: 12,
  },
  quickStat: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  quickStatLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  quickStatValue: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 2,
  },
  sections: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 14,
    lineHeight: 20,
  },
  bottomActions: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  actionButtonPrimary: {
    flex: 2,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  actionButtonPrimaryText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
});
