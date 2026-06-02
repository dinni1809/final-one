export const formatCurrency = (amount: number) => `₹${amount}`;

export const formatPriceLevel = (level: number) => '₹'.repeat(Math.max(1, Math.min(level, 4)));

export const getImageUri = (seed: string, width = 900, height = 650) =>
  `https://images.unsplash.com/${seed}?auto=format&fit=crop&w=${width}&h=${height}&q=82`;
