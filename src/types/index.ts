// ==============================================================================
// DIGITAL HEROES (Level 1) - TypeScript Domain Models & Schemas
// Edition 2026
// ==============================================================================

export type UserRole = 'visitor' | 'subscriber' | 'admin';

export type SubscriptionPlan = 'monthly' | 'yearly';
export type SubscriptionStatus = 'active' | 'lapsed' | 'cancelled' | 'trial';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  avatarUrl: string;
  handicap: number;
  homeClub: string;
  charityId: string | null;
  charityPercentage: number; // min 10%
  createdAt: string;
}

export interface Subscription {
  id: string;
  userId: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  amount: number;
  currency: string;
  billingCycle: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  renewalDate: string;
}

export interface GolfScore {
  id: string;
  userId: string;
  score: number; // Stableford: 1 to 45
  date: string; // YYYY-MM-DD
  courseName: string;
  createdAt: string;
}

export interface CharityEvent {
  title: string;
  date: string;
  location: string;
  goal: string;
}

export type CharityCategory = 
  | 'Youth & Education'
  | 'Health & Research'
  | 'Environment & Conservation'
  | 'Community & Hunger'
  | 'Veterans & First Responders';

export interface Charity {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: CharityCategory;
  logoUrl: string;
  coverImage: string;
  totalRaised: number;
  isFeatured: boolean;
  upcomingEvents: CharityEvent[];
}

export type DrawStatus = 'scheduled' | 'simulated' | 'completed';
export type DrawLogicType = 'random' | 'algorithmic';

export interface Draw {
  id: string;
  drawNumber: number;
  title: string;
  drawDate: string;
  status: DrawStatus;
  logicType: DrawLogicType;
  drawnNumbers: number[] | null;
  totalPrizePool: number;
  jackpotPool: number;   // 40%
  tier2Pool: number;     // 35%
  tier3Pool: number;     // 25%
  rolloverJackpot: number;
  totalParticipants: number;
  isPublished: boolean;
  publishedAt?: string;
}

export type PrizeTier = 'jackpot' | 'tier2' | 'tier3' | 'none';

export interface DrawEntry {
  id: string;
  drawId: string;
  userId: string;
  submittedScores: number[];
  matchedCount: number;
  tierWon: PrizeTier;
  prizeAmount: number;
}

export type VerificationStatus = 'pending' | 'approved' | 'rejected';
export type PaymentStatus = 'pending' | 'paid';

export interface WinnerVerification {
  id: string;
  entryId: string;
  userId: string;
  userName: string;
  userEmail: string;
  drawId: string;
  drawNumber: number;
  matchedCount: number;
  tierWon: PrizeTier;
  prizeAmount: number;
  proofUrl: string;
  status: VerificationStatus;
  adminNotes?: string;
  paymentStatus: PaymentStatus;
  submittedAt: string;
  reviewedAt?: string;
  payoutDate?: string;
}

export interface DrawSimulation {
  drawnNumbers: number[];
  totalEntries: number;
  jackpotWinnersCount: number;
  tier2WinnersCount: number;
  tier3WinnersCount: number;
  jackpotPayoutPerWinner: number;
  tier2PayoutPerWinner: number;
  tier3PayoutPerWinner: number;
  jackpotWillRollover: boolean;
  frequencyDistribution?: { [score: number]: number };
}
