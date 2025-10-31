// src/utils/helpers.ts
/**
 * Format date to readable string
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Format time ago
 */
export const formatTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const intervals: { [key: string]: number } = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1,
  };

  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit);
    if (interval >= 1) {
      return `${interval} ${unit}${interval !== 1 ? 's' : ''} ago`;
    }
  }

  return 'Just now';
};

/**
 * Convert height to feet and inches
 */
export const cmToFeetInches = (cm: number): string => {
  const totalInches = cm / 2.54;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  return `${feet}' ${inches}"`;
};

/**
 * Calculate profile completion percentage
 */
export const calculateProfileCompletion = (profile: any): number => {
  let percentage = 0;

  // Basic info (15%)
  if (profile.profile_photo_url) percentage += 5;
  if (profile.date_of_birth) percentage += 5;
  if (profile.current_location) percentage += 5;

  // Faith profile (25%)
  if (profile.denomination) percentage += 5;
  if (profile.church_name) percentage += 5;
  if (profile.baptism_status) percentage += 5;
  if (profile.faith_statement) percentage += 10;

  // Verification (20%)
  if (profile.is_christian_verified) percentage += 10;
  if (profile.marriage_intent_verified) percentage += 10;

  // Personal details (20%)
  if (profile.education_level) percentage += 5;
  if (profile.profession) percentage += 5;
  if (profile.about_me && profile.about_me.length >= 100) percentage += 10;

  // Partner preferences (20%)
  if (profile.preferred_age_min && profile.preferred_age_max) percentage += 10;
  if (
    profile.preferred_denominations &&
    profile.preferred_denominations.length > 0
  )
    percentage += 10;

  return Math.min(percentage, 100);
};

/**
 * Generate initials from name
 */
export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

/**
 * Truncate text
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};
