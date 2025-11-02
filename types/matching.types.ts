import { InterestStatus, MatchStatus, User } from './user.types';

// src/types/matching.types.ts
export interface Match {
  id: string;
  user_id: string;
  matched_user_id: string;
  match_score: number;
  match_date: string;
  status: MatchStatus;
  created_at: string;
  matched_user?: User;
}

export interface Interest {
  id: string;
  sender_id: string;
  receiver_id: string;
  status: InterestStatus;
  message?: string;
  sent_at: string;
  responded_at?: string;
  sender?: User;
  receiver?: User;
}

export interface MatchFilters {
  age_min?: number;
  age_max?: number;
  denominations?: string[];
  location?: string;
  radius_km?: number;
  education_level?: string;
  must_share_denomination?: boolean;
}
