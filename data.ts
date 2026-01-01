export const MOCK_ASSETS = {
  USDT: 100,
  BTC: 1,
} as const;

export const LIMITS = {
  price: { min: 87510.22, max: 88373.72 },
  amount: { min: 0.000001, max: 10 },
} as const;

export const DECIMALS = {
  USDT: 2,
  BTC: 6,
  price: 2,
} as const;

export const FEE_PERCENTAGE = 0.015; // 1.5%
