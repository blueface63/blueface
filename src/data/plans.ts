import { InvestmentPlan } from '../types';

export const INVESTMENT_PLANS: InvestmentPlan[] = [
  {
    id: 'tkash-mine-1',
    name: 'Tkash Mine No.1 (Starter)',
    mineNumber: 1,
    minInvestment: 299,
    dailyIncome: 15,
    cycleDays: 90,
    totalIncome: 15 * 90, // 1,350 KES
    roiPercentage: Math.round(((15 * 90) / 299) * 100),
    status: 'hot',
    tag: 'Popular Starter',
    imageUrl: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=800&q=80',
    description: 'Entry-level mining yield contract with guaranteed daily returns credited every 24 hours.'
  },
  {
    id: 'tkash-mine-2',
    name: 'Tkash Mine No.2 (Standard)',
    mineNumber: 2,
    minInvestment: 499,
    dailyIncome: 59,
    cycleDays: 90,
    totalIncome: 59 * 90, // 5,310 KES
    roiPercentage: Math.round(((59 * 90) / 499) * 100),
    status: 'hot',
    tag: 'High Yield',
    imageUrl: 'https://images.unsplash.com/photo-1579226905180-636b76d96082?auto=format&fit=crop&w=800&q=80',
    description: 'Enhanced micro-rig equipment contract offering fast payback within 9 days.'
  },
  {
    id: 'tkash-mine-3',
    name: 'Tkash Mine No.3 (Bronze)',
    mineNumber: 3,
    minInvestment: 1000,
    dailyIncome: 125,
    cycleDays: 90,
    totalIncome: 125 * 90, // 11,250 KES
    roiPercentage: Math.round(((125 * 90) / 1000) * 100),
    status: 'active',
    tag: 'Recommended',
    imageUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80',
    description: 'Mid-scale gold ore extraction project with automated daily dividend payout.'
  },
  {
    id: 'tkash-mine-4',
    name: 'Tkash Mine No.4 (Silver)',
    mineNumber: 4,
    minInvestment: 3500,
    dailyIncome: 460,
    cycleDays: 90,
    totalIncome: 460 * 90, // 41,400 KES
    roiPercentage: Math.round(((460 * 90) / 3500) * 100),
    status: 'active',
    tag: 'Best Value',
    imageUrl: 'https://images.unsplash.com/photo-1618042164219-62c820f10723?auto=format&fit=crop&w=800&q=80',
    description: 'High capacity processing facility with stable returns and priority liquidity.'
  },
  {
    id: 'tkash-mine-5',
    name: 'Tkash Mine No.5 (Gold)',
    mineNumber: 5,
    minInvestment: 5000,
    dailyIncome: 690,
    cycleDays: 90,
    totalIncome: 690 * 90, // 62,100 KES
    roiPercentage: Math.round(((690 * 90) / 5000) * 100),
    status: 'active',
    tag: 'Top Performer',
    imageUrl: 'https://images.unsplash.com/photo-1624365168968-f283d549925e?auto=format&fit=crop&w=800&q=80',
    description: 'Industrial gold refinery share featuring premium dividend rates.'
  },
  {
    id: 'tkash-mine-6',
    name: 'Tkash Mine No.6 (Platinum)',
    mineNumber: 6,
    minInvestment: 8500,
    dailyIncome: 1220,
    cycleDays: 90,
    totalIncome: 1220 * 90, // 109,800 KES
    roiPercentage: Math.round(((1220 * 90) / 8500) * 100),
    status: 'active',
    tag: 'VIP Elite',
    imageUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=800&q=80',
    description: 'Deep mineral exploration unit with amplified automated cash-flow yields.'
  },
  {
    id: 'tkash-mine-7',
    name: 'Tkash Mine No.7 (Diamond)',
    mineNumber: 7,
    minInvestment: 12500,
    dailyIncome: 1850,
    cycleDays: 90,
    totalIncome: 1850 * 90, // 166,500 KES
    roiPercentage: Math.round(((1850 * 90) / 12500) * 100),
    status: 'limited',
    tag: 'Limited Slot',
    imageUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80',
    description: 'Strategic heavy metallurgical complex offering top-tier compound returns.'
  },
  {
    id: 'tkash-mine-8',
    name: 'Tkash Mine No.8 (Titanium)',
    mineNumber: 8,
    minInvestment: 15000,
    dailyIncome: 2300,
    cycleDays: 90,
    totalIncome: 2300 * 90, // 207,000 KES
    roiPercentage: Math.round(((2300 * 90) / 15000) * 100),
    status: 'active',
    tag: 'Master Tier',
    imageUrl: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=800&q=80',
    description: 'Sovereign-grade multi-ore excavation license delivering daily profits to M-Pesa.'
  },
  {
    id: 'tkash-mine-9',
    name: 'Tkash Mine No.9 (Crown Royal)',
    mineNumber: 9,
    minInvestment: 20000,
    dailyIncome: 3200,
    cycleDays: 90,
    totalIncome: 3200 * 90, // 288,000 KES
    roiPercentage: Math.round(((3200 * 90) / 20000) * 100),
    status: 'hot',
    tag: 'Highest Yield',
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    description: 'Flagship enterprise extraction powerhouse with maximum daily earning capacity.'
  }
];
