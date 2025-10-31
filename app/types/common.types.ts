// src/types/common.types.ts
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  success: boolean;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface UploadProgress {
  progress: number;
  fileName: string;
}

export type ThemeMode = 'light' | 'dark';

export interface AppTheme {
  mode: ThemeMode;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    textMuted: string;
    border: string;
    error: string;
    success: string;
    warning: string;
  };
}

// Marriage Intent Verification Questions
export interface MarriageIntentQuestion {
  id: string;
  question: string;
  type: 'single' | 'multiple' | 'text';
  options?: string[];
  required: boolean;
}

export interface MarriageIntentAnswer {
  question_id: string;
  answer: string | string[];
}

export interface FaithVerificationQuestion {
  id: string;
  question: string;
  type: 'single' | 'multiple' | 'text';
  options?: string[];
  required: boolean;
  validates_faith: boolean;
}

export interface FaithVerificationAnswer {
  question_id: string;
  answer: string | string[];
}

// Report and Safety
export interface Report {
  id: string;
  reporter_id: string;
  reported_user_id: string;
  reason: string;
  description?: string;
  status: 'pending' | 'reviewed' | 'action_taken';
  created_at: string;
}

export interface BlockedUser {
  id: string;
  blocker_id: string;
  blocked_user_id: string;
  created_at: string;
  blocked_user?: User;
}

// Profile Statistics
export interface ProfileStats {
  profile_views: number;
  interests_sent: number;
  interests_received: number;
  matches_count: number;
  messages_sent: number;
  messages_received: number;
}

// Notification Types
export interface Notification {
  id: string;
  user_id: string;
  type: 'match' | 'interest' | 'message' | 'verification' | 'system';
  title: string;
  message: string;
  is_read: boolean;
  data?: any;
  created_at: string;
}
