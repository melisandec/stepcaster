import { 
  User, 
  Achievement, 
  Quest, 
  AvatarItem, 
  AchievementRarity,
  Notification,
  SeasonalEvent
} from '../types/gamification';

// XP calculation constants
const XP_PER_STEP = 0.1;
const STREAK_BONUS_MULTIPLIER = 0.5;
const DAILY_BONUS_XP = 50;

// Level progression (exponential growth)
export const calculateLevel = (xp: number): number => {
  return Math.floor(Math.sqrt(xp / 100)) + 1;
};

export const calculateXPForNextLevel = (currentLevel: number): number => {
  return Math.pow(currentLevel, 2) * 100;
};

export const calculateXPProgress = (currentXP: number, currentLevel: number): number => {
  const xpForCurrentLevel = calculateXPForNextLevel(currentLevel - 1);
  const xpForNextLevel = calculateXPForNextLevel(currentLevel);
  const xpInCurrentLevel = currentXP - xpForCurrentLevel;
  const xpNeededForLevel = xpForNextLevel - xpForCurrentLevel;
  return (xpInCurrentLevel / xpNeededForLevel) * 100;
};

// Step coins calculation
export const calculateStepCoins = (steps: number, streak: number): number => {
  const baseCoins = Math.floor(steps / 1000); // 1 coin per 1000 steps
  const streakBonus = Math.floor(streak / 7) * 5; // Bonus coins for weekly streaks
  return baseCoins + streakBonus;
};

// Achievement definitions
export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_steps',
    name: 'First Steps',
    description: 'Complete your first step upload',
    icon: '👣',
    rarity: AchievementRarity.BRONZE,
    xpReward: 10,
    coinReward: 5,
    condition: { type: 'steps', value: 1, description: 'Upload your first steps' },
    unlocked: false
  },
  {
    id: 'step_master',
    name: 'Step Master',
    description: 'Reach 10,000 steps in a day',
    icon: '🏃‍♂️',
    rarity: AchievementRarity.SILVER,
    xpReward: 100,
    coinReward: 25,
    condition: { type: 'steps', value: 10000, description: 'Reach 10,000 steps in a day' },
    unlocked: false
  },
  {
    id: 'streak_warrior',
    name: 'Streak Warrior',
    description: 'Maintain a 7-day step streak',
    icon: '🔥',
    rarity: AchievementRarity.GOLD,
    xpReward: 250,
    coinReward: 50,
    condition: { type: 'streak', value: 7, description: 'Maintain a 7-day streak' },
    unlocked: false
  },
  {
    id: 'level_10',
    name: 'Fitness Enthusiast',
    description: 'Reach level 10',
    icon: '💪',
    rarity: AchievementRarity.GOLD,
    xpReward: 500,
    coinReward: 100,
    condition: { type: 'level', value: 10, description: 'Reach level 10' },
    unlocked: false
  },
  {
    id: 'step_legend',
    name: 'Step Legend',
    description: 'Reach 100,000 total steps',
    icon: '👑',
    rarity: AchievementRarity.PLATINUM,
    xpReward: 1000,
    coinReward: 200,
    condition: { type: 'steps', value: 100000, description: 'Reach 100,000 total steps' },
    unlocked: false
  },
  {
    id: 'streak_master',
    name: 'Streak Master',
    description: 'Maintain a 30-day step streak',
    icon: '🔥🔥',
    rarity: AchievementRarity.LEGENDARY,
    xpReward: 2000,
    coinReward: 500,
    condition: { type: 'streak', value: 30, description: 'Maintain a 30-day streak' },
    unlocked: false
  }
];

// Avatar items
export const AVATAR_ITEMS: AvatarItem[] = [
  // Hats
  { id: 'cap_basic', name: 'Basic Cap', type: 'hat', rarity: AchievementRarity.BRONZE, price: 10, image: '🧢', equipped: false, owned: false },
  { id: 'cap_sport', name: 'Sport Cap', type: 'hat', rarity: AchievementRarity.SILVER, price: 50, image: '🏃‍♂️', equipped: false, owned: false },
  { id: 'crown', name: 'Fitness Crown', type: 'hat', rarity: AchievementRarity.LEGENDARY, price: 1000, image: '👑', equipped: false, owned: false },
  
  // Shirts
  { id: 'tshirt_basic', name: 'Basic T-Shirt', type: 'shirt', rarity: AchievementRarity.BRONZE, price: 15, image: '👕', equipped: false, owned: false },
  { id: 'jersey', name: 'Fitness Jersey', type: 'shirt', rarity: AchievementRarity.GOLD, price: 150, image: '🏃‍♂️', equipped: false, owned: false },
  
  // Pants
  { id: 'shorts_basic', name: 'Basic Shorts', type: 'pants', rarity: AchievementRarity.BRONZE, price: 20, image: '🩳', equipped: false, owned: false },
  { id: 'track_pants', name: 'Track Pants', type: 'pants', rarity: AchievementRarity.SILVER, price: 75, image: '👖', equipped: false, owned: false },
  
  // Shoes
  { id: 'sneakers_basic', name: 'Basic Sneakers', type: 'shoes', rarity: AchievementRarity.BRONZE, price: 25, image: '👟', equipped: false, owned: false },
  { id: 'running_shoes', name: 'Running Shoes', type: 'shoes', rarity: AchievementRarity.GOLD, price: 200, image: '🏃‍♂️', equipped: false, owned: false },
  
  // Accessories
  { id: 'watch', name: 'Fitness Watch', type: 'accessory', rarity: AchievementRarity.SILVER, price: 100, image: '⌚', equipped: false, owned: false },
  { id: 'medal', name: 'Achievement Medal', type: 'accessory', rarity: AchievementRarity.GOLD, price: 300, image: '🏅', equipped: false, owned: false },
  
  // Backgrounds
  { id: 'bg_park', name: 'Park Background', type: 'background', rarity: AchievementRarity.BRONZE, price: 30, image: '🌳', equipped: false, owned: false },
  { id: 'bg_gym', name: 'Gym Background', type: 'background', rarity: AchievementRarity.SILVER, price: 80, image: '🏋️‍♂️', equipped: false, owned: false },
  { id: 'bg_mountain', name: 'Mountain Background', type: 'background', rarity: AchievementRarity.GOLD, price: 250, image: '⛰️', equipped: false, owned: false }
];

// Daily quests
export const generateDailyQuests = (): Quest[] => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  return [
    {
      id: 'daily_5k',
      title: '5K Steps',
      description: 'Walk 5,000 steps today',
      type: 'daily',
      target: 5000,
      current: 0,
      reward: { xp: 50, coins: 10 },
      expiresAt: tomorrow,
      completed: false
    },
    {
      id: 'daily_10k',
      title: '10K Steps',
      description: 'Walk 10,000 steps today',
      type: 'daily',
      target: 10000,
      current: 0,
      reward: { xp: 100, coins: 25 },
      expiresAt: tomorrow,
      completed: false
    },
    {
      id: 'daily_streak',
      title: 'Keep the Streak',
      description: 'Maintain your step streak',
      type: 'daily',
      target: 1,
      current: 0,
      reward: { xp: 25, coins: 5 },
      expiresAt: tomorrow,
      completed: false
    }
  ];
};

// Weekly quests
export const generateWeeklyQuests = (): Quest[] => {
  const today = new Date();
  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);
  nextWeek.setHours(0, 0, 0, 0);

  return [
    {
      id: 'weekly_50k',
      title: '50K Weekly Goal',
      description: 'Walk 50,000 steps this week',
      type: 'weekly',
      target: 50000,
      current: 0,
      reward: { xp: 300, coins: 75 },
      expiresAt: nextWeek,
      completed: false
    },
    {
      id: 'weekly_7days',
      title: 'Perfect Week',
      description: 'Upload steps for 7 consecutive days',
      type: 'weekly',
      target: 7,
      current: 0,
      reward: { xp: 200, coins: 50 },
      expiresAt: nextWeek,
      completed: false
    }
  ];
};

// Seasonal events
export const SEASONAL_EVENTS: SeasonalEvent[] = [
  {
    id: 'summer_fitness',
    name: 'Summer Fitness Challenge',
    description: 'Stay active during the summer months!',
    startDate: new Date('2024-06-01'),
    endDate: new Date('2024-08-31'),
    active: new Date() >= new Date('2024-06-01') && new Date() <= new Date('2024-08-31'),
    challenges: [
      {
        id: 'summer_100k',
        title: 'Summer 100K',
        description: 'Walk 100,000 steps during summer',
        type: 'seasonal',
        target: 100000,
        current: 0,
        reward: { xp: 1000, coins: 250, items: [AVATAR_ITEMS.find(item => item.id === 'crown')!] },
        expiresAt: new Date('2024-08-31'),
        completed: false
      }
    ],
    specialRewards: [
      AVATAR_ITEMS.find(item => item.id === 'crown')!,
      AVATAR_ITEMS.find(item => item.id === 'bg_mountain')!
    ]
  }
];

// Gamification service class
export class GamificationService {
  private user: User;
  private achievements: Achievement[];
  private quests: Quest[];
  private avatarItems: AvatarItem[];
  private notifications: Notification[];

  constructor(userAddress: string) {
    this.user = this.initializeUser(userAddress);
    this.achievements = [...ACHIEVEMENTS];
    this.quests = [...generateDailyQuests(), ...generateWeeklyQuests()];
    this.avatarItems = [...AVATAR_ITEMS];
    this.notifications = [];
    this.loadUserData();
  }

  private initializeUser(address: string): User {
    return {
      id: address,
      address,
      level: 1,
      xp: 0,
      stepCoins: 0,
      totalSteps: 0,
      currentStreak: 0,
      bestStreak: 0,
      joinDate: new Date(),
      lastActive: new Date()
    };
  }

  private loadUserData(): void {
    const savedData = localStorage.getItem(`gamification_${this.user.address}`);
    if (savedData) {
      const data = JSON.parse(savedData);
      this.user = { ...this.user, ...data.user };
      this.achievements = data.achievements || this.achievements;
      this.quests = data.quests || this.quests;
      this.avatarItems = data.avatarItems || this.avatarItems;
      this.notifications = data.notifications || this.notifications;
    }
  }

  private saveUserData(): void {
    const data = {
      user: this.user,
      achievements: this.achievements,
      quests: this.quests,
      avatarItems: this.avatarItems,
      notifications: this.notifications
    };
    localStorage.setItem(`gamification_${this.user.address}`, JSON.stringify(data));
  }

  public processStepUpload(steps: number): {
    xpGained: number;
    coinsGained: number;
    levelUp: boolean;
    newLevel?: number;
    achievementsUnlocked: Achievement[];
    questsCompleted: Quest[];
    notifications: Notification[];
  } {
    const oldLevel = this.user.level;
    const xpGained = this.calculateXPGain(steps);
    const coinsGained = calculateStepCoins(steps, this.user.currentStreak);
    
    // Update user stats
    this.user.xp += xpGained;
    this.user.stepCoins += coinsGained;
    this.user.totalSteps += steps;
    this.user.currentStreak += 1;
    this.user.bestStreak = Math.max(this.user.bestStreak, this.user.currentStreak);
    this.user.lastActive = new Date();
    
    // Check for level up
    const newLevel = calculateLevel(this.user.xp);
    const levelUp = newLevel > oldLevel;
    if (levelUp) {
      this.user.level = newLevel;
    }

    // Check achievements
    const achievementsUnlocked = this.checkAchievements();

    // Update quests
    const questsCompleted = this.updateQuests(steps);

    // Generate notifications
    const notifications = this.generateNotifications(xpGained, coinsGained, levelUp, achievementsUnlocked, questsCompleted);

    this.saveUserData();
    
    return {
      xpGained,
      coinsGained,
      levelUp,
      newLevel: levelUp ? newLevel : undefined,
      achievementsUnlocked,
      questsCompleted,
      notifications
    };
  }

  private calculateXPGain(steps: number): number {
    let xp = steps * XP_PER_STEP;
    
    // Streak bonus
    if (this.user.currentStreak > 0) {
      xp += steps * XP_PER_STEP * STREAK_BONUS_MULTIPLIER * Math.min(this.user.currentStreak / 7, 1);
    }

    // Daily bonus (first upload of the day)
    const today = new Date().toDateString();
    const lastActive = this.user.lastActive.toDateString();
    if (today !== lastActive) {
      xp += DAILY_BONUS_XP;
    }

    return Math.floor(xp);
  }

  private checkAchievements(): Achievement[] {
    const unlocked: Achievement[] = [];
    
    this.achievements.forEach(achievement => {
      if (achievement.unlocked) return;
      
      let shouldUnlock = false;
      
      switch (achievement.condition.type) {
        case 'steps':
          if (achievement.condition.value <= 10000) {
            // Daily step achievements
            shouldUnlock = this.user.totalSteps >= achievement.condition.value;
          } else {
            // Total step achievements
            shouldUnlock = this.user.totalSteps >= achievement.condition.value;
          }
          break;
        case 'streak':
          shouldUnlock = this.user.currentStreak >= achievement.condition.value;
          break;
        case 'level':
          shouldUnlock = this.user.level >= achievement.condition.value;
          break;
        case 'coins':
          shouldUnlock = this.user.stepCoins >= achievement.condition.value;
          break;
      }
      
      if (shouldUnlock) {
        achievement.unlocked = true;
        achievement.unlockedAt = new Date();
        this.user.xp += achievement.xpReward;
        this.user.stepCoins += achievement.coinReward;
        unlocked.push(achievement);
      }
    });
    
    return unlocked;
  }

  private updateQuests(steps: number): Quest[] {
    const completed: Quest[] = [];
    
    this.quests.forEach(quest => {
      if (quest.completed) return;
      
      if (quest.id === 'daily_5k' || quest.id === 'daily_10k') {
        quest.current += steps;
      } else if (quest.id === 'daily_streak') {
        quest.current = this.user.currentStreak;
      } else if (quest.id === 'weekly_50k') {
        quest.current += steps;
      } else if (quest.id === 'weekly_7days') {
        quest.current = this.user.currentStreak;
      }
      
      if (quest.current >= quest.target) {
        quest.completed = true;
        quest.completedAt = new Date();
        this.user.xp += quest.reward.xp;
        this.user.stepCoins += quest.reward.coins;
        completed.push(quest);
      }
    });
    
    return completed;
  }

  private generateNotifications(
    xpGained: number,
    coinsGained: number,
    levelUp: boolean,
    achievementsUnlocked: Achievement[],
    questsCompleted: Quest[]
  ): Notification[] {
    const notifications: Notification[] = [];
    
    // XP gained notification
    notifications.push({
      id: `xp_${Date.now()}`,
      type: 'achievement',
      title: 'XP Gained!',
      message: `+${xpGained} XP from your steps!`,
      timestamp: new Date(),
      read: false
    });
    
    // Coins gained notification
    notifications.push({
      id: `coins_${Date.now()}`,
      type: 'achievement',
      title: 'StepCoins Earned!',
      message: `+${coinsGained} StepCoins earned!`,
      timestamp: new Date(),
      read: false
    });
    
    // Level up notification
    if (levelUp) {
      notifications.push({
        id: `level_${Date.now()}`,
        type: 'level_up',
        title: 'Level Up!',
        message: `Congratulations! You reached level ${this.user.level}!`,
        timestamp: new Date(),
        read: false,
        data: { newLevel: this.user.level }
      });
    }
    
    // Achievement notifications
    achievementsUnlocked.forEach(achievement => {
      notifications.push({
        id: `achievement_${achievement.id}_${Date.now()}`,
        type: 'achievement',
        title: 'Achievement Unlocked!',
        message: `${achievement.name} - ${achievement.description}`,
        timestamp: new Date(),
        read: false,
        data: { achievement }
      });
    });
    
    // Quest completion notifications
    questsCompleted.forEach(quest => {
      notifications.push({
        id: `quest_${quest.id}_${Date.now()}`,
        type: 'quest_complete',
        title: 'Quest Completed!',
        message: `${quest.title} - +${quest.reward.xp} XP, +${quest.reward.coins} Coins`,
        timestamp: new Date(),
        read: false,
        data: { quest }
      });
    });
    
    this.notifications.push(...notifications);
    return notifications;
  }

  public purchaseItem(itemId: string): boolean {
    const item = this.avatarItems.find(i => i.id === itemId);
    if (!item || this.user.stepCoins < item.price) {
      return false;
    }
    
    this.user.stepCoins -= item.price;
    item.owned = true;
    this.saveUserData();
    
    return true;
  }

  public equipItem(itemId: string): boolean {
    const item = this.avatarItems.find(i => i.id === itemId);
    if (!item || !item.owned) {
      return false;
    }
    
    // Unequip other items of the same type
    this.avatarItems.forEach(i => {
      if (i.type === item.type) {
        i.equipped = false;
      }
    });
    
    item.equipped = true;
    this.saveUserData();
    
    return true;
  }

  public getEquippedItems(): AvatarItem[] {
    return this.avatarItems.filter(item => item.equipped);
  }

  public getOwnedItems(): AvatarItem[] {
    return this.avatarItems.filter(item => item.owned);
  }

  public getAvailableItems(): AvatarItem[] {
    return this.avatarItems.filter(item => !item.owned);
  }

  public getUser(): User {
    return { ...this.user };
  }

  public getAchievements(): Achievement[] {
    return [...this.achievements];
  }

  public getQuests(): Quest[] {
    return [...this.quests];
  }

  public getNotifications(): Notification[] {
    return [...this.notifications];
  }

  public markNotificationAsRead(notificationId: string): void {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
      this.saveUserData();
    }
  }

  public clearNotifications(): void {
    this.notifications = [];
    this.saveUserData();
  }
} 