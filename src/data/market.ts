import { MarketCommodity } from '../types';

export const INITIAL_MARKET_COMMODITIES: MarketCommodity[] = [
  {
    id: 'gold',
    name: 'Gold (Au 999.9)',
    unit: '/ ounce',
    priceUSD: 2841.90,
    priceKES: 369447.00,
    change24h: 0.95,
    icon: 'gold'
  },
  {
    id: 'silver',
    name: 'Silver (Ag 925)',
    unit: '/ ounce',
    priceUSD: 33.42,
    priceKES: 4344.60,
    change24h: 1.65,
    icon: 'silver'
  },
  {
    id: 'platinum',
    name: 'Platinum',
    unit: '/ ounce',
    priceUSD: 1014.50,
    priceKES: 131885.00,
    change24h: -0.07,
    icon: 'platinum'
  },
  {
    id: 'palladium',
    name: 'Palladium',
    unit: '/ ounce',
    priceUSD: 1044.00,
    priceKES: 135720.00,
    change24h: 0.67,
    icon: 'palladium'
  },
  {
    id: 'wti-oil',
    name: 'WTI Crude Oil',
    unit: '/ barrel',
    priceUSD: 78.34,
    priceKES: 10184.20,
    change24h: 0.13,
    icon: 'oil'
  },
  {
    id: 'brent-oil',
    name: 'Brent Crude Oil',
    unit: '/ barrel',
    priceUSD: 82.29,
    priceKES: 10697.70,
    change24h: -0.63,
    icon: 'brent'
  },
  {
    id: 'natural-gas',
    name: 'Natural Gas',
    unit: '/ MMBtu',
    priceUSD: 2.899,
    priceKES: 376.87,
    change24h: 2.01,
    icon: 'gas'
  },
  {
    id: 'copper',
    name: 'Copper',
    unit: '/ pound',
    priceUSD: 4.854,
    priceKES: 631.02,
    change24h: 0.89,
    icon: 'copper'
  }
];
