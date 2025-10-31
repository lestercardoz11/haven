// src/utils/validation.ts
export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validate email address
 */
export const validateEmail = (email: string): ValidationResult => {
  if (!email || email.trim() === '') {
    return { isValid: false, error: 'Email is required' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }

  return { isValid: true };
};

/**
 * Validate password strength
 */
export const validatePassword = (password: string): ValidationResult => {
  if (!password || password.trim() === '') {
    return { isValid: false, error: 'Password is required' };
  }

  if (password.length < 8) {
    return {
      isValid: false,
      error: 'Password must be at least 8 characters long',
    };
  }

  if (!/[A-Z]/.test(password)) {
    return {
      isValid: false,
      error: 'Password must contain at least one uppercase letter',
    };
  }

  if (!/[a-z]/.test(password)) {
    return {
      isValid: false,
      error: 'Password must contain at least one lowercase letter',
    };
  }

  if (!/[0-9]/.test(password)) {
    return {
      isValid: false,
      error: 'Password must contain at least one number',
    };
  }

  return { isValid: true };
};

/**
 * Get password strength
 */
export const getPasswordStrength = (
  password: string
): {
  strength: 'weak' | 'medium' | 'strong';
  percentage: number;
} => {
  let score = 0;

  if (password.length >= 8) score += 25;
  if (password.length >= 12) score += 25;
  if (/[A-Z]/.test(password)) score += 15;
  if (/[a-z]/.test(password)) score += 15;
  if (/[0-9]/.test(password)) score += 10;
  if (/[^A-Za-z0-9]/.test(password)) score += 10;

  if (score <= 40) return { strength: 'weak', percentage: score };
  if (score <= 70) return { strength: 'medium', percentage: score };
  return { strength: 'strong', percentage: score };
};

/**
 * Validate phone number
 */
export const validatePhone = (phone: string): ValidationResult => {
  if (!phone || phone.trim() === '') {
    return { isValid: false, error: 'Phone number is required' };
  }

  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '');

  if (cleaned.length < 10) {
    return { isValid: false, error: 'Please enter a valid phone number' };
  }

  return { isValid: true };
};

/**
 * Calculate age from date of birth
 */
export const calculateAge = (dateOfBirth: string): number => {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
};

/**
 * Validate date of birth
 */
export const validateDateOfBirth = (dateOfBirth: string): ValidationResult => {
  if (!dateOfBirth || dateOfBirth.trim() === '') {
    return { isValid: false, error: 'Date of birth is required' };
  }

  const age = calculateAge(dateOfBirth);

  if (age < 21) {
    return {
      isValid: false,
      error: 'You must be at least 21 years old to join',
    };
  }

  if (age > 100) {
    return { isValid: false, error: 'Please enter a valid date of birth' };
  }

  return { isValid: true };
};

/**
 * Validate required text field
 */
export const validateRequired = (
  value: string,
  fieldName: string
): ValidationResult => {
  if (!value || value.trim() === '') {
    return { isValid: false, error: `${fieldName} is required` };
  }
  return { isValid: true };
};

/**
 * Validate text length
 */
export const validateLength = (
  value: string,
  minLength: number,
  maxLength: number,
  fieldName: string
): ValidationResult => {
  if (value.length < minLength) {
    return {
      isValid: false,
      error: `${fieldName} must be at least ${minLength} characters`,
    };
  }

  if (value.length > maxLength) {
    return {
      isValid: false,
      error: `${fieldName} must not exceed ${maxLength} characters`,
    };
  }

  return { isValid: true };
};

/**
 * Validate profile photo
 */
export const validateProfilePhoto = (
  uri: string | undefined
): ValidationResult => {
  if (!uri) {
    return { isValid: false, error: 'Profile photo is required' };
  }
  return { isValid: true };
};

/**
 * Check if content contains inappropriate words
 */
export const containsInappropriateContent = (text: string): boolean => {
  const inappropriateWords = [
    'dating',
    'hookup',
    'casual',
    'fun',
    'fling',
    // Add more words that indicate non-marriage intentions
  ];

  const lowerText = text.toLowerCase();
  return inappropriateWords.some((word) => lowerText.includes(word));
};

/**
 * Validate marriage intent in text
 */
export const validateMarriageIntent = (text: string): ValidationResult => {
  const marriageKeywords = [
    'marriage',
    'marry',
    'lifetime',
    'committed',
    'spouse',
    'partner',
    'family',
    'forever',
    'serious',
  ];

  const lowerText = text.toLowerCase();
  const hasMarriageIntent = marriageKeywords.some((keyword) =>
    lowerText.includes(keyword)
  );

  if (!hasMarriageIntent) {
    return {
      isValid: false,
      error: 'Your response should demonstrate serious marriage intentions',
    };
  }

  if (containsInappropriateContent(text)) {
    return {
      isValid: false,
      error: 'Please focus on marriage-oriented goals',
    };
  }

  return { isValid: true };
};

/**
 * Validate Christian faith in text
 */
export const validateChristianFaith = (text: string): ValidationResult => {
  const faithKeywords = [
    'jesus',
    'christ',
    'god',
    'lord',
    'savior',
    'bible',
    'scripture',
    'gospel',
    'faith',
    'salvation',
    'church',
    'christian',
    'prayer',
    'worship',
  ];

  const lowerText = text.toLowerCase();
  const hasFaithKeywords = faithKeywords.some((keyword) =>
    lowerText.includes(keyword)
  );

  if (!hasFaithKeywords) {
    return {
      isValid: false,
      error: 'Your response should demonstrate Christian faith',
    };
  }

  return { isValid: true };
};
