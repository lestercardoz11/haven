// src/types/navigation.types.ts
export type AuthStackParamList = {
  Welcome: undefined;
  SignIn: undefined;
  Registration: undefined;
  Onboarding: undefined;
};

export type ProfileCreationStackParamList = {
  BasicInformation: undefined;
  FaithProfile: undefined;
  VerificationUpload: undefined;
  PersonalDetails: undefined;
  PartnerPreferences: undefined;
  VerificationPending: undefined;
};

export type MainStackParamList = {
  Home: undefined;
  Matches: undefined;
  Messages: undefined;
  Profile: undefined;
  Settings: undefined;
  Chat: { conversationId: string; otherUserId: string };
  ProfileDetail: { userId: string };
};
