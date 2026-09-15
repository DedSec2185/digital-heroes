import { Charity, Draw, DrawEntry, GolfScore, Subscription, UserProfile, WinnerVerification } from '../types';

export const INITIAL_CHARITIES: Charity[] = [
  {
    id: 'c1111111-1111-1111-1111-111111111111',
    name: 'Fairway Dreams Foundation',
    tagline: 'Empowering underprivileged youth through mentorship & sport',
    description: 'Fairway Dreams provides equipment, golf coaching, and academic tutoring to youth in underserved communities across the nation. Over 12,000 children have graduated through our life-skills academy.',
    category: 'Youth & Education',
    logoUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=160&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=800&auto=format&fit=crop&q=80',
    totalRaised: 48250,
    isFeatured: true,
    upcomingEvents: [
      { title: 'Annual Youth Open Charity Day', date: '2026-10-15', location: 'Pebble Beach, CA', goal: '$50,000' }
    ]
  },
  {
    id: 'c2222222-2222-2222-2222-222222222222',
    name: 'Clean Ocean Alliance',
    tagline: 'Restoring marine ecosystems and eradicating coastal plastic waste',
    description: 'Working directly with coastal fishing communities to recover marine debris and protect coral reef biodiversity. Every dollar raised extracts 5 lbs of plastic from ocean waters.',
    category: 'Environment & Conservation',
    logoUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=160&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&auto=format&fit=crop&q=80',
    totalRaised: 34120,
    isFeatured: true,
    upcomingEvents: [
      { title: 'Coastal Conservation Scramble', date: '2026-11-04', location: 'Torrey Pines, CA', goal: '$35,000' }
    ]
  },
  {
    id: 'c3333333-3333-3333-3333-333333333333',
    name: 'Hope Cancer Research',
    tagline: 'Funding next-generation targeted immunotherapy clinical trials',
    description: 'Dedicated to accelerating early-detection cancer diagnostics and providing emotional and housing support grants to families receiving outpatient treatments.',
    category: 'Health & Research',
    logoUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=160&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=800&auto=format&fit=crop&q=80',
    totalRaised: 72900,
    isFeatured: true,
    upcomingEvents: [
      { title: 'Swing for the Cure Invitational', date: '2026-09-28', location: 'Pinehurst No. 2, NC', goal: '$80,000' }
    ]
  },
  {
    id: 'c4444444-4444-4444-4444-444444444444',
    name: 'Veterans Forward Initiative',
    tagline: 'Rehabilitation, adaptive athletics, and transition careers for heroes',
    description: 'Connecting injured veterans with adaptive sports, mental health counseling, and direct career placement in tech and renewable energy fields.',
    category: 'Veterans & First Responders',
    logoUrl: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=160&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1508847154043-be5407fcaa5a?w=800&auto=format&fit=crop&q=80',
    totalRaised: 21500,
    isFeatured: false,
    upcomingEvents: [
      { title: 'Honor & Drive Pro-Am', date: '2026-10-30', location: 'Kiawah Island, SC', goal: '$25,000' }
    ]
  }
];

export const INITIAL_USERS: UserProfile[] = [
  {
    id: 'b2222222-bbbb-2222-bbbb-222222222222',
    email: 'abhayraj@digitalheroes.com',
    fullName: 'Abhayraj Singh',
    role: 'subscriber',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    handicap: 9.8,
    homeClub: 'St. Andrews Links',
    charityId: 'c3333333-3333-3333-3333-333333333333',
    charityPercentage: 20.0,
    createdAt: '2026-01-10T10:00:00Z',
  },
  {
    id: 'a1111111-aaaa-1111-aaaa-111111111111',
    email: 'admin@digitalheroes.com',
    fullName: 'Sarah Vance (Platform Admin)',
    role: 'admin',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    handicap: 4.2,
    homeClub: 'The Royal Troon',
    charityId: 'c1111111-1111-1111-1111-111111111111',
    charityPercentage: 15.0,
    createdAt: '2025-11-01T08:00:00Z',
  },
  {
    id: 'b3333333-cccc-3333-cccc-333333333333',
    email: 'marcus.chen@example.com',
    fullName: 'Marcus Chen',
    role: 'subscriber',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    handicap: 14.0,
    homeClub: 'Augusta National Club',
    charityId: 'c2222222-2222-2222-2222-222222222222',
    charityPercentage: 12.5,
    createdAt: '2026-02-14T12:00:00Z',
  },
  {
    id: 'b4444444-dddd-4444-dddd-444444444444',
    email: 'elena.rostova@example.com',
    fullName: 'Elena Rostova',
    role: 'subscriber',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80',
    handicap: 7.5,
    homeClub: 'Whistling Straits',
    charityId: 'c1111111-1111-1111-1111-111111111111',
    charityPercentage: 10.0,
    createdAt: '2026-03-01T09:00:00Z',
  }
];

export const INITIAL_SUBSCRIPTIONS: { [userId: string]: Subscription } = {
  'b2222222-bbbb-2222-bbbb-222222222222': {
    id: 's2222222-2222-2222-2222-222222222222',
    userId: 'b2222222-bbbb-2222-bbbb-222222222222',
    plan: 'monthly',
    status: 'active',
    amount: 19.99,
    currency: 'USD',
    billingCycle: 'Monthly ($19.99/mo)',
    currentPeriodStart: '2026-09-01T00:00:00Z',
    currentPeriodEnd: '2026-10-01T00:00:00Z',
    renewalDate: '2026-10-01',
  },
  'a1111111-aaaa-1111-aaaa-111111111111': {
    id: 's1111111-1111-1111-1111-111111111111',
    userId: 'a1111111-aaaa-1111-aaaa-111111111111',
    plan: 'yearly',
    status: 'active',
    amount: 180.00,
    currency: 'USD',
    billingCycle: 'Yearly ($180/yr - 25% Off)',
    currentPeriodStart: '2026-01-01T00:00:00Z',
    currentPeriodEnd: '2027-01-01T00:00:00Z',
    renewalDate: '2027-01-01',
  }
};

export const INITIAL_SCORES: { [userId: string]: GolfScore[] } = {
  'b2222222-bbbb-2222-bbbb-222222222222': [
    { id: 'sc_1', userId: 'b2222222-bbbb-2222-bbbb-222222222222', score: 38, date: '2026-09-14', courseName: 'St. Andrews Old Course', createdAt: '2026-09-14T17:00:00Z' },
    { id: 'sc_2', userId: 'b2222222-bbbb-2222-bbbb-222222222222', score: 34, date: '2026-09-11', courseName: 'Carnoustie Championship Links', createdAt: '2026-09-11T16:30:00Z' },
    { id: 'sc_3', userId: 'b2222222-bbbb-2222-bbbb-222222222222', score: 41, date: '2026-09-07', courseName: 'Kingsbarns Golf Links', createdAt: '2026-09-07T15:00:00Z' },
    { id: 'sc_4', userId: 'b2222222-bbbb-2222-bbbb-222222222222', score: 29, date: '2026-09-01', courseName: 'Gleneagles PGA Centenary', createdAt: '2026-09-01T14:15:00Z' },
    { id: 'sc_5', userId: 'b2222222-bbbb-2222-bbbb-222222222222', score: 36, date: '2026-08-25', courseName: 'Muirfield Links', createdAt: '2026-08-25T11:20:00Z' },
  ],
  'b3333333-cccc-3333-cccc-333333333333': [
    { id: 'sc_6', userId: 'b3333333-cccc-3333-cccc-333333333333', score: 32, date: '2026-09-13', courseName: 'Augusta National', createdAt: '2026-09-13T10:00:00Z' },
    { id: 'sc_7', userId: 'b3333333-cccc-3333-cccc-333333333333', score: 38, date: '2026-09-09', courseName: 'East Lake Golf Club', createdAt: '2026-09-09T10:00:00Z' },
    { id: 'sc_8', userId: 'b3333333-cccc-3333-cccc-333333333333', score: 27, date: '2026-09-04', courseName: 'Sawgrass Stadium Course', createdAt: '2026-09-04T10:00:00Z' },
    { id: 'sc_9', userId: 'b3333333-cccc-3333-cccc-333333333333', score: 35, date: '2026-08-30', courseName: 'Bay Hill Club', createdAt: '2026-08-30T10:00:00Z' },
    { id: 'sc_10', userId: 'b3333333-cccc-3333-cccc-333333333333', score: 42, date: '2026-08-24', courseName: 'Innisbrook Copperhead', createdAt: '2026-08-24T10:00:00Z' },
  ],
  'b4444444-dddd-4444-dddd-444444444444': [
    { id: 'sc_11', userId: 'b4444444-dddd-4444-dddd-444444444444', score: 40, date: '2026-09-12', courseName: 'Whistling Straits', createdAt: '2026-09-12T10:00:00Z' },
    { id: 'sc_12', userId: 'b4444444-dddd-4444-dddd-444444444444', score: 38, date: '2026-09-08', courseName: 'Blackwolf Run', createdAt: '2026-09-08T10:00:00Z' },
    { id: 'sc_13', userId: 'b4444444-dddd-4444-dddd-444444444444', score: 34, date: '2026-09-03', courseName: 'Erin Hills Golf Course', createdAt: '2026-09-03T10:00:00Z' },
    { id: 'sc_14', userId: 'b4444444-dddd-4444-dddd-444444444444', score: 31, date: '2026-08-28', courseName: 'Sand Valley Dunes', createdAt: '2026-08-28T10:00:00Z' },
    { id: 'sc_15', userId: 'b4444444-dddd-4444-dddd-444444444444', score: 44, date: '2026-08-21', courseName: 'SentryWorld Course', createdAt: '2026-08-21T10:00:00Z' },
  ]
};

export const INITIAL_DRAWS: Draw[] = [
  {
    id: 'd1111111-1111-1111-1111-111111111111',
    drawNumber: 101,
    title: 'August 2026 Monthly Charity Draw',
    drawDate: '2026-08-31T20:00:00Z',
    status: 'completed',
    logicType: 'random',
    drawnNumbers: [38, 34, 41, 19, 7],
    totalPrizePool: 25000,
    jackpotPool: 10000, // Rolled over!
    tier2Pool: 8750,
    tier3Pool: 6250,
    rolloverJackpot: 10000,
    totalParticipants: 1480,
    isPublished: true,
    publishedAt: '2026-08-31T20:05:00Z',
  },
  {
    id: 'd2222222-2222-2222-2222-222222222222',
    drawNumber: 102,
    title: 'September 2026 Autumn Championship Draw',
    drawDate: '2026-09-28T20:00:00Z',
    status: 'scheduled',
    logicType: 'algorithmic',
    drawnNumbers: null,
    totalPrizePool: 35000, // $25k base + $10k rollover
    jackpotPool: 20000, // $10k base + $10k rollover
    tier2Pool: 8750,
    tier3Pool: 6250,
    rolloverJackpot: 10000,
    totalParticipants: 1620,
    isPublished: false,
  }
];

export const INITIAL_VERIFICATIONS: WinnerVerification[] = [
  {
    id: 'v1111111-1111-1111-1111-111111111111',
    entryId: 'e1111111-1111-1111-1111-111111111111',
    userId: 'b2222222-bbbb-2222-bbbb-222222222222',
    userName: 'Abhayraj Singh',
    userEmail: 'abhayraj@digitalheroes.com',
    drawId: 'd1111111-1111-1111-1111-111111111111',
    drawNumber: 101,
    matchedCount: 3,
    tierWon: 'tier3',
    prizeAmount: 781.25,
    proofUrl: 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=800&auto=format&fit=crop&q=80',
    status: 'approved',
    adminNotes: 'Verified against Scottish Golf Union official handicap portal. All 3 matched scores confirmed.',
    paymentStatus: 'paid',
    submittedAt: '2026-09-01T12:00:00Z',
    reviewedAt: '2026-09-02T14:30:00Z',
    payoutDate: '2026-09-03T09:00:00Z',
  }
];
