import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  UserRole, 
  UserProfile, 
  Charity, 
  GolfScore, 
  Subscription, 
  Draw, 
  WinnerVerification, 
  DrawSimulation, 
  DrawLogicType, 
  PrizeTier,
  SubscriptionPlan 
} from '../types';
import { 
  INITIAL_CHARITIES, 
  INITIAL_USERS, 
  INITIAL_SUBSCRIPTIONS, 
  INITIAL_SCORES, 
  INITIAL_DRAWS, 
  INITIAL_VERIFICATIONS 
} from '../lib/initialData';
import { ScoreEngine } from '../lib/scoreEngine';
import { DrawEngine } from '../lib/drawEngine';
import { CharityEngine } from '../lib/charityEngine';

interface AppContextType {
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  currentUser: UserProfile;
  allUsers: UserProfile[];
  subscription: Subscription | null;
  userScores: GolfScore[];
  allScores: { [userId: string]: GolfScore[] };
  charities: Charity[];
  draws: Draw[];
  activeDraw: Draw | undefined;
  verifications: WinnerVerification[];
  selectedCharity: Charity | undefined;
  
  // Actions
  addScore: (score: number, date: string, courseName?: string) => { success: boolean; error?: string };
  updateScore: (id: string, score: number, date: string, courseName?: string) => { success: boolean; error?: string };
  deleteScore: (id: string) => void;
  updateCharityPreference: (charityId: string, percentage: number) => void;
  subscribeUser: (plan: SubscriptionPlan, charityId: string, percentage: number) => void;
  cancelSubscription: () => void;
  renewSubscription: () => void;
  
  // Draw operations (§ 06, § 07, § 11.2)
  runDrawSimulation: (logicType: DrawLogicType) => DrawSimulation;
  publishOfficialDraw: (drawnNumbers: number[], logicType: DrawLogicType) => { success: boolean; winnersCount: number };
  
  // Winner Verification operations (§ 09, § 11.4)
  submitWinnerProof: (verificationId: string, proofUrl: string) => void;
  reviewWinnerProof: (verificationId: string, status: 'approved' | 'rejected', notes?: string) => void;
  markPayoutCompleted: (verificationId: string) => void;
  
  // Admin Charity CRUD (§ 11.3)
  addCharity: (charity: Omit<Charity, 'id' | 'totalRaised'>) => void;
  updateCharity: (id: string, updates: Partial<Charity>) => void;
  deleteCharity: (id: string) => void;

  // Admin User Score Override (§ 11.1)
  adminOverrideScores: (userId: string, scores: GolfScore[]) => void;
  adminToggleUserSubscription: (userId: string) => void;
  
  // Reset demo
  resetState: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = 'digital_heroes_platform_state_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load state from local storage or initial seed
  const [currentRole, setCurrentRole] = useState<UserRole>('subscriber');
  const [allUsers, setAllUsers] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });
  const [charities, setCharities] = useState<Charity[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_charities');
    return saved ? JSON.parse(saved) : INITIAL_CHARITIES;
  });
  const [subscriptions, setSubscriptions] = useState<{ [userId: string]: Subscription }>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_subscriptions');
    return saved ? JSON.parse(saved) : INITIAL_SUBSCRIPTIONS;
  });
  const [allScores, setAllScores] = useState<{ [userId: string]: GolfScore[] }>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_scores');
    return saved ? JSON.parse(saved) : INITIAL_SCORES;
  });
  const [draws, setDraws] = useState<Draw[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_draws');
    return saved ? JSON.parse(saved) : INITIAL_DRAWS;
  });
  const [verifications, setVerifications] = useState<WinnerVerification[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_verifications');
    return saved ? JSON.parse(saved) : INITIAL_VERIFICATIONS;
  });

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY + '_users', JSON.stringify(allUsers));
    localStorage.setItem(STORAGE_KEY + '_charities', JSON.stringify(charities));
    localStorage.setItem(STORAGE_KEY + '_subscriptions', JSON.stringify(subscriptions));
    localStorage.setItem(STORAGE_KEY + '_scores', JSON.stringify(allScores));
    localStorage.setItem(STORAGE_KEY + '_draws', JSON.stringify(draws));
    localStorage.setItem(STORAGE_KEY + '_verifications', JSON.stringify(verifications));
  }, [allUsers, charities, subscriptions, allScores, draws, verifications]);

  // Determine current active user based on role
  const currentUser = currentRole === 'admin' 
    ? allUsers.find(u => u.role === 'admin') || allUsers[1]
    : allUsers.find(u => u.email === 'abhayraj@digitalheroes.com') || allUsers[0];

  const userScores = allScores[currentUser.id] || [];
  const subscription = subscriptions[currentUser.id] || null;
  const selectedCharity = charities.find(c => c.id === currentUser.charityId);
  const activeDraw = draws.find(d => d.status === 'scheduled');

  // Add Score with strictly enforced Section 05 logic
  const addScore = (score: number, date: string, courseName?: string) => {
    const res = ScoreEngine.processNewScore(userScores, {
      userId: currentUser.id,
      score,
      date,
      courseName,
    });

    if (!res.success || !res.updatedScores) {
      return { success: false, error: res.error };
    }

    setAllScores(prev => ({
      ...prev,
      [currentUser.id]: res.updatedScores!,
    }));

    return { success: true };
  };

  const updateScore = (id: string, score: number, date: string, courseName?: string) => {
    const res = ScoreEngine.updateScore(userScores, id, { score, date, courseName });
    if (!res.success || !res.updatedScores) {
      return { success: false, error: res.error };
    }
    setAllScores(prev => ({
      ...prev,
      [currentUser.id]: res.updatedScores!,
    }));
    return { success: true };
  };

  const deleteScore = (id: string) => {
    const updated = ScoreEngine.deleteScore(userScores, id);
    setAllScores(prev => ({
      ...prev,
      [currentUser.id]: updated,
    }));
  };

  const updateCharityPreference = (charityId: string, percentage: number) => {
    const valid = CharityEngine.validatePercentage(percentage).corrected;
    setAllUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, charityId, charityPercentage: valid } : u));
  };

  const subscribeUser = (plan: SubscriptionPlan, charityId: string, percentage: number) => {
    const validPercentage = CharityEngine.validatePercentage(percentage).corrected;
    const amount = plan === 'monthly' ? 19.99 : 180.00;
    const sub: Subscription = {
      id: 'sub_' + Math.random().toString(36).substring(2, 9),
      userId: currentUser.id,
      plan,
      status: 'active',
      amount,
      currency: 'USD',
      billingCycle: plan === 'monthly' ? 'Monthly ($19.99/mo)' : 'Yearly ($180/yr - 25% Off)',
      currentPeriodStart: new Date().toISOString(),
      currentPeriodEnd: new Date(Date.now() + 30 * 86400000).toISOString(),
      renewalDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
    };

    setSubscriptions(prev => ({ ...prev, [currentUser.id]: sub }));
    setAllUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, charityId, charityPercentage: validPercentage } : u));
    
    // Increment charity total raised
    const donation = CharityEngine.calculateSubscriptionDonation(plan, validPercentage).charityAmount;
    setCharities(prev => prev.map(c => c.id === charityId ? { ...c, totalRaised: c.totalRaised + donation } : c));
  };

  const cancelSubscription = () => {
    if (!subscription) return;
    setSubscriptions(prev => ({
      ...prev,
      [currentUser.id]: { ...subscription, status: 'cancelled' }
    }));
  };

  const renewSubscription = () => {
    if (!subscription) return;
    setSubscriptions(prev => ({
      ...prev,
      [currentUser.id]: { 
        ...subscription, 
        status: 'active',
        renewalDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]
      }
    }));
  };

  // Run Dry-Run Draw Simulation (§ 06, § 07, § 11.2)
  const runDrawSimulation = (logicType: DrawLogicType): DrawSimulation => {
    const candidateNumbers = logicType === 'algorithmic'
      ? DrawEngine.generateAlgorithmicNumbers(Object.values(allScores).flat())
      : DrawEngine.generateRandomNumbers();

    const participants = allUsers
      .filter(u => subscriptions[u.id]?.status === 'active')
      .map(u => ({ user: u, scores: allScores[u.id] || [] }));

    const pool = {
      total: activeDraw?.totalPrizePool || 35000,
      jackpot: activeDraw?.jackpotPool || 20000,
      tier2: activeDraw?.tier2Pool || 8750,
      tier3: activeDraw?.tier3Pool || 6250,
    };

    return DrawEngine.simulateDraw(candidateNumbers, participants, pool);
  };

  // Publish Official Draw (§ 06, § 07)
  const publishOfficialDraw = (drawnNumbers: number[], logicType: DrawLogicType) => {
    if (!activeDraw) return { success: false, winnersCount: 0 };

    const participants = allUsers
      .filter(u => subscriptions[u.id]?.status === 'active')
      .map(u => ({ user: u, scores: allScores[u.id] || [] }));

    const simulation = DrawEngine.simulateDraw(drawnNumbers, participants, {
      total: activeDraw.totalPrizePool,
      jackpot: activeDraw.jackpotPool,
      tier2: activeDraw.tier2Pool,
      tier3: activeDraw.tier3Pool,
    });

    const newVerifications: WinnerVerification[] = [];

    // Identify winners and generate verification requests (§ 09)
    participants.forEach(({ user, scores }) => {
      const numbers = scores.slice(0, 5).map(s => s.score);
      const { matchedCount } = DrawEngine.calculateMatches(numbers, drawnNumbers);
      const tier = DrawEngine.determineTier(matchedCount);

      if (tier !== 'none') {
        let prize = 0;
        if (tier === 'jackpot') prize = simulation.jackpotPayoutPerWinner;
        else if (tier === 'tier2') prize = simulation.tier2PayoutPerWinner;
        else if (tier === 'tier3') prize = simulation.tier3PayoutPerWinner;

        newVerifications.push({
          id: 'v_' + Math.random().toString(36).substring(2, 9),
          entryId: 'e_' + Math.random().toString(36).substring(2, 9),
          userId: user.id,
          userName: user.fullName,
          userEmail: user.email,
          drawId: activeDraw.id,
          drawNumber: activeDraw.drawNumber,
          matchedCount,
          tierWon: tier,
          prizeAmount: prize,
          proofUrl: '',
          status: 'pending',
          paymentStatus: 'pending',
          submittedAt: new Date().toISOString(),
        });
      }
    });

    // Handle jackpot rollover if 0 jackpot winners (§ 06, § 07)
    const nextRollover = simulation.jackpotWillRollover
      ? (activeDraw.rolloverJackpot || 0) + (activeDraw.jackpotPool * 0.5)
      : 0;

    // Complete active draw
    const completedDraw: Draw = {
      ...activeDraw,
      status: 'completed',
      logicType,
      drawnNumbers,
      isPublished: true,
      publishedAt: new Date().toISOString(),
    };

    // Spawn next scheduled draw with rollover applied
    const nextDrawNumber = activeDraw.drawNumber + 1;
    const nextPool = DrawEngine.calculatePrizePool(participants.length + 150, nextRollover);
    const nextDraw: Draw = {
      id: 'draw_' + Math.random().toString(36).substring(2, 9),
      drawNumber: nextDrawNumber,
      title: `Draw #${nextDrawNumber} - Autumn Championship`,
      drawDate: new Date(Date.now() + 30 * 86400000).toISOString(),
      status: 'scheduled',
      logicType: 'random',
      drawnNumbers: null,
      totalPrizePool: nextPool.totalPrizePool,
      jackpotPool: nextPool.jackpotPool,
      tier2Pool: nextPool.tier2Pool,
      tier3Pool: nextPool.tier3Pool,
      rolloverJackpot: nextRollover,
      totalParticipants: participants.length + 150,
      isPublished: false,
    };

    setDraws(prev => [nextDraw, completedDraw, ...prev.filter(d => d.id !== activeDraw.id)]);
    if (newVerifications.length > 0) {
      setVerifications(prev => [...newVerifications, ...prev]);
    }

    return { success: true, winnersCount: newVerifications.length };
  };

  // Winner Verification Actions (§ 09, § 11.4)
  const submitWinnerProof = (verificationId: string, proofUrl: string) => {
    setVerifications(prev => prev.map(v => 
      v.id === verificationId ? { ...v, proofUrl, status: 'pending' } : v
    ));
  };

  const reviewWinnerProof = (verificationId: string, status: 'approved' | 'rejected', notes?: string) => {
    setVerifications(prev => prev.map(v => 
      v.id === verificationId ? { 
        ...v, 
        status, 
        adminNotes: notes || (status === 'approved' ? 'Verified by admin' : 'Rejected - invalid scorecard screenshot'),
        reviewedAt: new Date().toISOString()
      } : v
    ));
  };

  const markPayoutCompleted = (verificationId: string) => {
    setVerifications(prev => prev.map(v => 
      v.id === verificationId ? { ...v, paymentStatus: 'paid', payoutDate: new Date().toISOString() } : v
    ));
  };

  // Charity CRUD (§ 11.3)
  const addCharity = (charityData: Omit<Charity, 'id' | 'totalRaised'>) => {
    const newCharity: Charity = {
      ...charityData,
      id: 'c_' + Math.random().toString(36).substring(2, 9),
      totalRaised: 0,
    };
    setCharities(prev => [newCharity, ...prev]);
  };

  const updateCharity = (id: string, updates: Partial<Charity>) => {
    setCharities(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const deleteCharity = (id: string) => {
    setCharities(prev => prev.filter(c => c.id !== id));
  };

  const adminOverrideScores = (userId: string, scores: GolfScore[]) => {
    setAllScores(prev => ({ ...prev, [userId]: scores }));
  };

  const adminToggleUserSubscription = (userId: string) => {
    setSubscriptions(prev => {
      const current = prev[userId];
      if (!current) return prev;
      const nextStatus = current.status === 'active' ? 'cancelled' : 'active';
      return {
        ...prev,
        [userId]: { ...current, status: nextStatus }
      };
    });
  };

  const resetState = () => {
    localStorage.removeItem(STORAGE_KEY + '_users');
    localStorage.removeItem(STORAGE_KEY + '_charities');
    localStorage.removeItem(STORAGE_KEY + '_subscriptions');
    localStorage.removeItem(STORAGE_KEY + '_scores');
    localStorage.removeItem(STORAGE_KEY + '_draws');
    localStorage.removeItem(STORAGE_KEY + '_verifications');
    setAllUsers(INITIAL_USERS);
    setCharities(INITIAL_CHARITIES);
    setSubscriptions(INITIAL_SUBSCRIPTIONS);
    setAllScores(INITIAL_SCORES);
    setDraws(INITIAL_DRAWS);
    setVerifications(INITIAL_VERIFICATIONS);
    setCurrentRole('subscriber');
  };

  return (
    <AppContext.Provider value={{
      currentRole,
      setCurrentRole,
      currentUser,
      allUsers,
      subscription,
      userScores,
      allScores,
      charities,
      draws,
      activeDraw,
      verifications,
      selectedCharity,
      addScore,
      updateScore,
      deleteScore,
      updateCharityPreference,
      subscribeUser,
      cancelSubscription,
      renewSubscription,
      runDrawSimulation,
      publishOfficialDraw,
      submitWinnerProof,
      reviewWinnerProof,
      markPayoutCompleted,
      addCharity,
      updateCharity,
      deleteCharity,
      adminOverrideScores,
      adminToggleUserSubscription,
      resetState,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
