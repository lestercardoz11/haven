// src/screens/MatchesScreen.tsx
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../hooks/useAuth';
import { useMatches } from '../hooks/useMatches';
import { Match } from '../types/matching.types';

export const MatchesScreen = ({ navigation }: any) => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const { matches, loading, refreshMatches } = useMatches(user!.id);
  const [activeTab, setActiveTab] = useState<'new' | 'all' | 'sent'>('new');

  const filteredMatches = matches.filter((match) => {
    if (activeTab === 'new') return match.status === 'new';
    if (activeTab === 'sent') return match.status === 'interested';
    return true;
  });

  const renderMatch = ({ item }: { item: Match }) => {
    const profile = item.matched_user!;
    const age = profile.date_of_birth
      ? new Date().getFullYear() - new Date(profile.date_of_birth).getFullYear()
      : '';

    return (
      <TouchableOpacity
        style={[
          styles.matchCard,
          {
            backgroundColor: theme.colors.background,
            borderColor: theme.colors.border,
          },
        ]}
        onPress={() =>
          navigation.navigate('ProfileDetail', { userId: profile.id })
        }>
        <Image
          source={{
            uri: profile.profile_photo_url || 'https://via.placeholder.com/100',
          }}
          style={styles.matchPhoto}
        />
        <View style={styles.matchInfo}>
          <View style={styles.matchHeader}>
            <Text style={[styles.matchName, { color: theme.colors.text }]}>
              {profile.full_name.split(' ')[0]}, {age}
            </Text>
            <Ionicons name='checkmark-circle' size={20} color='#4CD964' />
          </View>
          <Text
            style={[styles.matchLocation, { color: theme.colors.textMuted }]}>
            {profile.current_location}
          </Text>
          <View style={styles.matchBadge}>
            <Ionicons name='heart' size={14} color='#FFD700' />
            <Text style={[styles.matchScore, { color: '#FFD700' }]}>
              {item.match_score}% Match
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={[
            styles.connectButton,
            { backgroundColor: theme.colors.primary },
          ]}
          onPress={() => {
            /* Handle connect */
          }}>
          <Text style={styles.connectButtonText}>Connect</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
          Matches
        </Text>
        <TouchableOpacity>
          <Ionicons
            name='options-outline'
            size={24}
            color={theme.colors.text}
          />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={[styles.tabs, { borderBottomColor: theme.colors.border }]}>
        {(['new', 'all', 'sent'] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}>
            <Text
              style={[
                styles.tabText,
                {
                  color:
                    activeTab === tab
                      ? theme.colors.primary
                      : theme.colors.textMuted,
                  fontWeight: activeTab === tab ? '700' : '500',
                },
              ]}>
              {tab === 'new'
                ? 'New Matches'
                : tab === 'all'
                ? 'All Matches'
                : 'Sent Interests'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Matches List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size='large' color={theme.colors.primary} />
        </View>
      ) : (
        <FlatList
          data={filteredMatches}
          renderItem={renderMatch}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          onRefresh={refreshMatches}
          refreshing={loading}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Home Screen styles
  card: {
    flex: 1,
    margin: 16,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 32,
    // background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
  },
  matchBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,215,0,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 12,
    gap: 4,
  },
  matchText: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: '600',
  },
  profileInfo: {
    gap: 8,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  profileName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
  },
  profileLocation: {
    fontSize: 16,
    color: '#ffffff',
    opacity: 0.9,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    color: '#ffffff',
    fontSize: 14,
  },
  viewProfileButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    paddingVertical: 20,
  },
  actionButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  passButton: {
    backgroundColor: '#ffffff',
  },
  interestButton: {
    backgroundColor: '#4CD964',
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  refreshButton: {
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 24,
  },
  refreshButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  // Matches Screen styles
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingTop: 60,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    paddingHorizontal: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: '#2a5d8d',
  },
  tabText: {
    fontSize: 14,
  },
  listContent: {
    padding: 16,
  },
  matchCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  matchPhoto: {
    width: 96,
    height: 96,
    borderRadius: 12,
  },
  matchInfo: {
    flex: 1,
    marginLeft: 16,
  },
  matchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  matchName: {
    fontSize: 16,
    fontWeight: '700',
  },
  matchLocation: {
    fontSize: 14,
    marginTop: 4,
  },
  matchScore: {
    fontSize: 12,
    fontWeight: '600',
  },
  connectButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  connectButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Messages Screen styles
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 48,
    borderRadius: 24,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  conversationItem: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  conversationContent: {
    flex: 1,
    marginLeft: 12,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  conversationName: {
    fontSize: 16,
  },
  conversationTime: {
    fontSize: 12,
  },
  conversationPreview: {
    fontSize: 14,
  },
  unreadBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadCount: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
});
