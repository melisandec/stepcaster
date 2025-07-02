export interface User {
  id: string;
  address: string;
  username?: string;
  avatar?: string;
  level: number;
  xp: number;
  stepCoins: number;
  totalSteps: number;
  currentStreak: number;
  bestStreak: number;
  joinDate: Date;
  lastActive: Date;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: AchievementRarity;
  xpReward: number;
  coinReward: number;
  condition: AchievementCondition;
  unlocked: boolean;
  unlockedAt?: Date;
}

export enum AchievementRarity {
  BRONZE = 'bronze',
  SILVER = 'silver',
  GOLD = 'gold',
  PLATINUM = 'platinum',
  LEGENDARY = 'legendary'
}

export interface AchievementCondition {
  type: 'steps' | 'streak' | 'level' | 'coins' | 'daily' | 'weekly';
  value: number;
  description: string;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly' | 'seasonal';
  target: number;
  current: number;
  reward: QuestReward;
  expiresAt: Date;
  completed: boolean;
  completedAt?: Date;
}

export interface QuestReward {
  xp: number;
  coins: number;
  items?: AvatarItem[];
}

export interface AvatarItem {
  id: string;
  name: string;
  type: 'hat' | 'shirt' | 'pants' | 'shoes' | 'accessory' | 'background';
  rarity: AchievementRarity;
  price: number;
  image: string;
  equipped: boolean;
  owned: boolean;
}

export interface Level {
  level: number;
  xpRequired: number;
  rewards: LevelReward;
  title: string;
}

export interface LevelReward {
  coins: number;
  items?: AvatarItem[];
  features?: string[];
}

export interface SeasonalEvent {
  id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  active: boolean;
  challenges: Quest[];
  specialRewards: AvatarItem[];
}

export interface LeaderboardEntry {
  user: User;
  rank: number;
  xp: number;
  level: number;
  totalSteps: number;
  streak: number;
}

export interface GamificationState {
  user: User;
  achievements: Achievement[];
  quests: Quest[];
  avatarItems: AvatarItem[];
  seasonalEvents: SeasonalEvent[];
  leaderboard: LeaderboardEntry[];
  notifications: Notification[];
}

export interface Notification {
  id: string;
  type: 'achievement' | 'level_up' | 'quest_complete' | 'streak' | 'event';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  data?: any;
} 