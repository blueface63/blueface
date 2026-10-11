export interface InvestmentPlan {
  id: string;
  name: string;
  mineNumber: number;
  minInvestment: number;
  dailyIncome: number;
  cycleDays: number;
  totalIncome: number;
  roiPercentage: number;
  status: 'active' | 'hot' | 'sold_out' | 'limited';
  tag?: string;
  imageUrl: string;
  description: string;
}

export interface UserInvestment {
  id: string;
  planId: string;
  planName: string;
  mineNumber: number;
  investedAmount: number;
  dailyIncome: number;
  cycleDays: number;
  daysElapsed: number;
  totalEarned: number;
  startDate: string;
  nextClaimTime: number; // timestamp
  lastClaimDate?: string;
  status: 'running' | 'completed';
}

export interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'investment' | 'daily_income' | 'referral_bonus' | 'mission_reward';
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'processing';
  reference: string;
  details?: string;
}

export interface MissionTask {
  id: string;
  title: string;
  description: string;
  targetCount: number;
  currentCount: number;
  rewardKES: number;
  isCompleted: boolean;
  isClaimed: boolean;
  type: 'referral' | 'checkin' | 'first_invest';
}

export interface UserProfile {
  phone: string;
  id: string;
  referralCode: string;
  referredBy?: string;
  balanceKES: number;
  rechargeBalanceKES: number;
  totalEarningsKES: number;
  todayEarningsKES: number;
  teamSize: number;
  teamCommissionKES: number;
  vipLevel: number;
  avatarUrl: string;
  joinedDate: string;
  activeInvestmentsCount: number;
}

export interface MarketCommodity {
  id: string;
  name: string;
  unit: string;
  priceUSD: number;
  priceKES: number;
  change24h: number;
  icon: string;
}
