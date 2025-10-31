// src/utils/constants.ts
export const COLORS = {
  primary: '#2a5d8d',
  secondary: '#d4af37',
  backgroundLight: '#f6f7f8',
  backgroundDark: '#13191f',
  textLight: '#101519',
  textDark: '#f8f9fa',
  textMutedLight: '#5a748c',
  textMutedDark: '#adb5bd',
  borderLight: '#d3dce3',
  borderDark: '#343a40',
  success: '#4CD964',
  error: '#D0021B',
  warning: '#F5A623',
  accentGold: '#F8D347',
};

export const DENOMINATIONS = [
  'Catholic',
  'Baptist',
  'Methodist',
  'Lutheran',
  'Presbyterian',
  'Pentecostal',
  'Anglican/Episcopal',
  'Orthodox',
  'Evangelical',
  'Non-denominational',
  'Assembly of God',
  'Church of Christ',
  'Seventh-day Adventist',
  'Other',
];

export const CHURCH_ATTENDANCE_FREQUENCY = [
  'Weekly',
  'Multiple times per week',
  'Every other week',
  'Monthly',
  'Occasionally',
  'Special occasions only',
];

export const MINISTRY_INVOLVEMENT = [
  'Youth Group',
  'Worship Team',
  'Bible Study',
  'Missions',
  'Volunteering',
  'Small Group',
  'Teaching/Preaching',
  'Choir',
  "Children's Ministry",
  'Outreach',
];

export const EDUCATION_LEVELS = [
  'High School',
  'Some College',
  "Associate's Degree",
  "Bachelor's Degree",
  "Master's Degree",
  'Doctorate',
  'Professional Degree',
];

export const HOBBIES = [
  'Reading',
  'Traveling',
  'Cooking',
  'Hiking',
  'Music',
  'Volunteering',
  'Sports',
  'Photography',
  'Art',
  'Writing',
  'Gardening',
  'Dancing',
  'Fitness',
  'Board Games',
];

export const LANGUAGES = [
  'English',
  'Spanish',
  'French',
  'German',
  'Italian',
  'Portuguese',
  'Chinese',
  'Japanese',
  'Korean',
  'Arabic',
  'Hindi',
  'Russian',
  'Other',
];

export const DEALBREAKERS = [
  'Smoking',
  'Drinking',
  'Drugs',
  'Different Faith',
  'Wants Children',
  'Has Children',
  'Long Distance',
  'Divorced',
  'Different Political Views',
];

export const MARRIAGE_INTENT_QUESTIONS = [
  {
    id: 'intent_1',
    question: 'What are you looking for on this platform?',
    type: 'single',
    options: [
      'A lifelong marriage partner',
      'Dating and seeing where it goes',
      'Making friends',
      'Not sure yet',
    ],
    required: true,
  },
  {
    id: 'intent_2',
    question: 'What is your timeline for marriage?',
    type: 'single',
    options: [
      'Within 1 year',
      '1-2 years',
      '2-3 years',
      '3+ years',
      'No specific timeline',
    ],
    required: true,
  },
  {
    id: 'intent_3',
    question: 'Why is marriage important to you?',
    type: 'text',
    required: true,
  },
  {
    id: 'intent_4',
    question: 'What does commitment mean to you in marriage?',
    type: 'text',
    required: true,
  },
];

export const FAITH_VERIFICATION_QUESTIONS = [
  {
    id: 'faith_1',
    question: 'Tell us about your faith journey',
    type: 'text',
    required: true,
  },
  {
    id: 'faith_2',
    question: 'What does your relationship with Jesus Christ mean to you?',
    type: 'text',
    required: true,
  },
  {
    id: 'faith_3',
    question: 'How do you practice your faith daily?',
    type: 'text',
    required: true,
  },
  {
    id: 'faith_4',
    question: 'What role does the Bible play in your life?',
    type: 'text',
    required: true,
  },
  {
    id: 'faith_5',
    question: 'What is your favorite Bible verse and why?',
    type: 'text',
    required: true,
  },
];

export const PROFILE_COMPLETION_WEIGHTS = {
  basicInfo: 15,
  faithProfile: 25,
  verification: 20,
  personalDetails: 20,
  partnerPreferences: 20,
};

export const MIN_AGE = 21;
export const MAX_AGE = 100;
export const MIN_HEIGHT_CM = 120;
export const MAX_HEIGHT_CM = 230;
export const MAX_ABOUT_ME_LENGTH = 500;
export const MAX_FAITH_STATEMENT_LENGTH = 1000;
export const MAX_MESSAGE_LENGTH = 1000;
