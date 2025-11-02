// src/screens/HomeScreen.tsx
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/hooks/useAuth';
import { matchingService } from '@/services/matching.service';
import { Match } from '@/types/matching.types';
import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export const HomeScreen = ({ navigation }: any) => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  const loadMatches = useCallback(async () => {
    try {
      setLoading(true);
      const result = await matchingService.getPotentialMatches(user!.id);
      if (result.success && result.data) {
        setMatches(result.data);
      }
    } catch (error) {
      console.error('Error loading matches:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadMatches();
  }, [loadMatches]);

  const handlePass = async () => {
    if (matches.length === 0) return;
    const currentMatch = matches[currentIndex];
    await matchingService.passMatch(user!.id, currentMatch.matched_user_id);

    if (currentIndex < matches.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setMatches([]);
    }
  };

  const handleInterest = async () => {
    if (matches.length === 0) return;
    const currentMatch = matches[currentIndex];
    await matchingService.sendInterest(user!.id, currentMatch.matched_user_id);

    if (currentIndex < matches.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setMatches([]);
    }
  };

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          styles.centered,
          { backgroundColor: theme.colors.background },
        ]}>
        <ActivityIndicator size='large' color={theme.colors.primary} />
      </View>
    );
  }

  if (matches.length === 0) {
    return (
      <View
        style={[
          styles.container,
          styles.centered,
          { backgroundColor: theme.colors.background },
        ]}>
        <Ionicons
          name='heart-dislike-outline'
          size={80}
          color={theme.colors.textMuted}
        />
        <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
          No More Matches
        </Text>
        <Text style={[styles.emptyText, { color: theme.colors.textMuted }]}>
          Check back soon for new faith-centered connections!
        </Text>
        <TouchableOpacity
          style={[
            styles.refreshButton,
            { backgroundColor: theme.colors.primary },
          ]}
          onPress={loadMatches}>
          <Text style={styles.refreshButtonText}>Refresh</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Carousel
        width={screenWidth}
        height={screenHeight - 200}
        data={matches}
        onSnapToItem={setCurrentIndex}
        renderItem={({ item }) => {
          const profile = item.matched_user!;
          return (
            <View style={styles.card}>
              <Image
                source={{
                  uri:
                    profile.profile_photo_url ||
                    'https://via.placeholder.com/400',
                }}
                style={styles.cardImage}
              />

              {/* Profile Info Overlay */}
              <View style={styles.cardOverlay}>
                <View style={styles.matchBadge}>
                  <Ionicons name='heart' size={16} color='#FFD700' />
                  <Text style={styles.matchText}>
                    {item.match_score}% Match
                  </Text>
                </View>

                <View style={styles.profileInfo}>
                  <View style={styles.nameRow}>
                    <Text style={styles.profileName}>
                      {profile.full_name.split(' ')[0]},{' '}
                      {profile.date_of_birth
                        ? new Date().getFullYear() -
                          new Date(profile.date_of_birth).getFullYear()
                        : ''}
                    </Text>
                    <Ionicons
                      name='checkmark-circle'
                      size={24}
                      color='#4CD964'
                    />
                  </View>
                  <Text style={styles.profileLocation}>
                    <Ionicons name='location' size={14} />{' '}
                    {profile.current_location}
                  </Text>

                  <View style={styles.statsRow}>
                    <View style={styles.statItem}>
                      <Ionicons name='school' size={16} color='#ffffff' />
                      <Text style={styles.statText}>
                        {profile.education_level}
                      </Text>
                    </View>
                    <View style={styles.statItem}>
                      <Ionicons name='briefcase' size={16} color='#ffffff' />
                      <Text style={styles.statText}>{profile.profession}</Text>
                    </View>
                    <View style={styles.statItem}>
                      <Ionicons name='airplane' size={16} color='#ffffff' />
                      <Text style={styles.statText}>
                        {profile.denomination}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* View Profile Button */}
              <TouchableOpacity
                style={styles.viewProfileButton}
                onPress={() =>
                  navigation.navigate('ProfileDetail', { userId: profile.id })
                }>
                <Ionicons
                  name='information-circle-outline'
                  size={24}
                  color='#ffffff'
                />
              </TouchableOpacity>
            </View>
          );
        }}
      />

      {/* Action Buttons */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.passButton]}
          onPress={handlePass}>
          <Ionicons name='close' size={32} color='#D0021B' />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.interestButton]}
          onPress={handleInterest}>
          <Ionicons name='heart' size={32} color='#ffffff' />
        </TouchableOpacity>
      </View>
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
