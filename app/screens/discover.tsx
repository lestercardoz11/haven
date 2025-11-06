
import { useAuth } from '@/hooks/useAuth';
import { matchingService } from '@/services/matching.service';
import { Match, MatchFilters } from '@/types/matching.types';
import { User } from '@/types/user.types';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import CardStack, { Card } from 'react-native-card-stack-swiper';
import * as Location from 'expo-location';


const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const CardItemSearch = ({ user }: { user: User }) => {
    return (
        <View style={styles.card}>
            <Image
                source={{
                    uri:
                        user.profile_photo_url ||
                        'https://via.placeholder.com/400',
                }}
                style={styles.cardImage}
            />
            <View style={styles.cardOverlay}>
                <View style={styles.profileInfo}>
                    <View style={styles.nameRow}>
                        <Text style={styles.profileName}>
                            {user.full_name.split(' ')[0]},{' '}
                            {user.date_of_birth
                                ? new Date().getFullYear() -
                                new Date(user.date_of_birth).getFullYear()
                                : ''}
                        </Text>
                    </View>
                    <Text style={styles.profileLocation}>
                        {user.current_location}
                    </Text>
                </View>
            </View>
        </View>
    );
};

export default function DiscoverScreen() {
    const { user } = useAuth();
    const [matches, setMatches] = useState<Match[]>([]);
    const [loading, setLoading] = useState(true);
    const swiper = useRef<CardStack | null>(null);
    const [location, setLocation] = useState<Location.LocationObject | null>(null);


    const loadMatches = useCallback(async () => {
        try {
            setLoading(true);
            let filters: MatchFilters = {};
            if (location) {
                filters.location = `${location.coords.latitude},${location.coords.longitude}`
            }
            const result = await matchingService.getPotentialMatches(user!.id, filters);
            if (result.success && result.data) {
                setMatches(result.data);
            }
        } catch (error) {
            console.error('Error loading matches:', error);
        } finally {
            setLoading(false);
        }
    }, [user, location]);


    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.error('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);
        })();
    }, []);


    useEffect(() => {
        loadMatches();
    }, [loadMatches]);

    const handlePass = async (index: number) => {
        if (matches.length === 0) return;
        const currentMatch = matches[index];
        await matchingService.passMatch(user!.id, currentMatch.matched_user_id);
    };

    const handleInterest = async (index: number) => {
        if (matches.length === 0) return;
        const currentMatch = matches[index];
        await matchingService.sendInterest(user!.id, currentMatch.matched_user_id);
    };

    if (loading) {
        return (
            <View
                style={[
                    styles.container,
                    styles.centered,
                ]}>
                <ActivityIndicator size='large' />
            </View>
        );
    }

    if (matches.length === 0) {
        return (
            <View
                style={[
                    styles.container,
                    styles.centered,
                ]}>
                <Text style={styles.emptyTitle}>
                    No More Matches
                </Text>
                <Text style={styles.emptyText}>
                    Check back soon for new faith-centered connections!
                </Text>
                <TouchableOpacity
                    style={
                        styles.refreshButton
                    }
                    onPress={loadMatches}>
                    <Text style={styles.refreshButtonText}>Refresh</Text>
                </TouchableOpacity>
            </View>
        );
    }


    return (
        <View style={styles.container}>
            <CardStack
                ref={swiper}
                style={{
                    justifyContent: 'flex-end',
                    alignItems: 'center'
                }}
                verticalSwipe={false}
                renderNoMoreCards={() => null}
                onSwipedLeft={handlePass}
                onSwipedRight={handleInterest}>
                {
                    matches.map((match) => (
                        <Card key={match.id}>
                            <CardItemSearch
                                user={match.matched_user!}
                            />
                        </Card>
                    ))
                }
            </CardStack>
            <View style={styles.actions}>
                <TouchableOpacity
                    style={[styles.actionButton, styles.passButton]}
                    onPress={() => swiper.current?.swipeLeft()}>
                    <Text>Pass</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.actionButton, styles.interestButton]}
                    onPress={() => swiper.current?.swipeRight()}>
                    <Text>Interest</Text>
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
    card: {
        width: screenWidth * 0.9,
        height: screenHeight * 0.7,
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
        backgroundColor: '#2a5d8d'
    },
    refreshButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '700',
    },
});
