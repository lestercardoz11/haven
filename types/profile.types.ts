import { BaptismStatus, Gender } from './user.types';

// src/types/profile.types.ts
export interface ProfileCreationStep1 {
  date_of_birth: string;
  gender: Gender;
  current_location: string;
  profile_photo_url?: string;
}

export interface ProfileCreationStep2 {
  denomination: string;
  church_name: string;
  church_address: string;
  years_practicing: number;
  is_baptized: boolean;
  baptism_status: BaptismStatus;
  church_attendance_frequency: string;
  ministry_involvement: string[];
}

export interface ProfileCreationStep3 {
  government_id_front?: string;
  government_id_back?: string;
  church_letter?: string;
  baptism_certificate?: string;
  selfie?: string;
}

export interface ProfileCreationStep4 {
  education_level: string;
  profession: string;
  height_cm: number;
  about_me: string;
  hobbies: string[];
  languages_spoken: string[];
}

export interface ProfileCreationStep5 {
  preferred_age_min: number;
  preferred_age_max: number;
  preferred_denominations: string[];
  preferred_location: string;
  preferred_radius_km: number;
  must_share_denomination: boolean;
  dealbreakers: string[];
}

export interface ProfileUpdateData {
  full_name?: string;
  phone?: string;
  date_of_birth?: string;
  gender?: Gender;
  current_location?: string;
  profile_photo_url?: string;
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
  height_cm?: number;
  education_level?: string;
  profession?: string;
  about_me?: string;
  hobbies?: string[];
  languages_spoken?: string[];
  preferred_age_min?: number;
  preferred_age_max?: number;
  preferred_denominations?: string[];
  preferred_location?: string;
  preferred_radius_km?: number;
  must_share_denomination?: boolean;
  dealbreakers?: string[];
  onboarding_completed?: boolean;
}
