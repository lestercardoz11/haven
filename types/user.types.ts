// src/types/user.types.ts
export type VerificationStatus =
  | 'pending'
  | 'under_review'
  | 'verified'
  | 'rejected';
export type Gender = 'male' | 'female';
export type BaptismStatus = 'yes' | 'no' | 'planning';
export type MatchStatus =
  | 'new'
  | 'viewed'
  | 'interested'
  | 'connected'
  | 'passed';
export type InterestStatus = 'pending' | 'accepted' | 'rejected';
export type MessageType = 'text' | 'image';

export interface User {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  date_of_birth: string;
  gender: Gender;
  current_location: string;
  profile_photo_url?: string;

  // Verification
  verification_status: VerificationStatus;
  verification_submitted_at?: string;
  verification_approved_at?: string;
  is_christian_verified: boolean;
  marriage_intent_verified: boolean;

  // Faith Information
  denomination?: string;
  church_name?: string;
  church_address?: string;
  years_practicing?: number;
  is_baptized?: boolean;
  baptism_status?: BaptismStatus;
  church_attendance_frequency?: string;
  ministry_involvement?: string[];
  favorite_scripture?: string;
  faith_statement?: string;

  // Personal Details
  height_cm?: number;
  education_level?: string;
  profession?: string;
  about_me?: string;
  hobbies?: string[];
  languages_spoken?: string[];

  // Partner Preferences
  preferred_age_min?: number;
  preferred_age_max?: number;
  preferred_denominations?: string[];
  preferred_location?: string;
  preferred_radius_km?: number;
  must_share_denomination?: boolean;
  dealbreakers?: string[];

  // Profile Status
  profile_completion_percentage: number;
  onboarding_completed: boolean;

  // Flags
  is_flagged: boolean;
  flag_reason?: string;
  is_active: boolean;
  last_active_at: string;

  created_at: string;
  updated_at: string;
}

export interface VerificationDocument {
  id: string;
  user_id: string;
  document_type:
    | 'government_id_front'
    | 'government_id_back'
    | 'church_letter'
    | 'baptism_certificate'
    | 'selfie';
  file_url: string;
  file_name?: string;
  upload_date: string;
  verification_status: 'pending' | 'approved' | 'rejected';
  reviewed_at?: string;
  reviewer_notes?: string;
  created_at: string;
}
