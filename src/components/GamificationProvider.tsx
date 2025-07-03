import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
// import { useAccount } from 'wagmi'; // so far we are simulating a connected wallet so we don't need to use wagmi cos we are not using useAccount
import { GamificationService } from '../services/gamificationService';
import { User, Achievement, Quest, AvatarItem, Notification } from '../types/gamification';

interface GamificationContextType {
  gamificationService: GamificationService | null;
  user: User | null;
  achievements: Achievement[];
  quests: Quest[];
  avatarItems: AvatarItem[];
  notifications: Notification[];
  processStepUpload: (steps: number) => {
    xpGained: number;
    coinsGained: number;
    levelUp: boolean;
    newLevel?: number;
    achievementsUnlocked: Achievement[];
    questsCompleted: Quest[];
    notifications: Notification[];
  };
  purchaseItem: (itemId: string) => boolean;
  equipItem: (itemId: string) => boolean;
  markNotificationAsRead: (notificationId: string) => void;
  clearNotifications: () => void;
  refreshData: () => void;
}

const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

interface GamificationProviderProps {
  children: ReactNode;
}

export const GamificationProvider: React.FC<GamificationProviderProps> = ({ children }) => {
  // Simulate a connected wallet for local testing
  const address = "0xFAKEADDRESS1234567890";
  const isConnected = true;
  // Uncomment to use real wallet connection
  // const { address, isConnected } = useAccount();
  const [gamificationService, setGamificationService] = useState<GamificationService | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [quests, setQuests] = useState<Quest[]>([]);
  const [avatarItems, setAvatarItems] = useState<AvatarItem[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (isConnected && address) {
      const service = new GamificationService(address);
      setGamificationService(service);
      refreshData(service);
    } else {
      setGamificationService(null);
      setUser(null);
      setAchievements([]);
      setQuests([]);
      setAvatarItems([]);
      setNotifications([]);
    }
  }, [isConnected, address]);

  const refreshData = (service?: GamificationService) => {
    const targetService = service || gamificationService;
    if (!targetService) return;

    setUser(targetService.getUser());
    setAchievements(targetService.getAchievements());
    setQuests(targetService.getQuests());
    setAvatarItems([...targetService.getOwnedItems(), ...targetService.getAvailableItems()]);
    setNotifications(targetService.getNotifications());
  };

  const processStepUpload = (steps: number) => {
    if (!gamificationService) {
      throw new Error('Gamification service not initialized');
    }

    const result = gamificationService.processStepUpload(steps);
    refreshData(gamificationService);
    return result;
  };

  const purchaseItem = (itemId: string): boolean => {
    if (!gamificationService) return false;
    
    const success = gamificationService.purchaseItem(itemId);
    if (success) {
      refreshData(gamificationService);
    }
    return success;
  };

  const equipItem = (itemId: string): boolean => {
    if (!gamificationService) return false;
    
    const success = gamificationService.equipItem(itemId);
    if (success) {
      refreshData(gamificationService);
    }
    return success;
  };

  const markNotificationAsRead = (notificationId: string) => {
    if (!gamificationService) return;
    
    gamificationService.markNotificationAsRead(notificationId);
    refreshData(gamificationService);
  };

  const clearNotifications = () => {
    if (!gamificationService) return;
    
    gamificationService.clearNotifications();
    refreshData(gamificationService);
  };

  const value: GamificationContextType = {
    gamificationService,
    user,
    achievements,
    quests,
    avatarItems,
    notifications,
    processStepUpload,
    purchaseItem,
    equipItem,
    markNotificationAsRead,
    clearNotifications,
    refreshData
  };

  return (
    <GamificationContext.Provider value={value}>
      {children}
    </GamificationContext.Provider>
  );
};

export const useGamification = (): GamificationContextType => {
  const context = useContext(GamificationContext);
  if (context === undefined) {
    throw new Error('useGamification must be used within a GamificationProvider');
  }
  return context;
}; 