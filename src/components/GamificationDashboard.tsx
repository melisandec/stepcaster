import React, { useState } from 'react';
import { useGamification } from './GamificationProvider';
import { calculateXPProgress } from '../services/gamificationService';
import { AchievementRarity } from '../types/gamification';
import { NotificationContainer } from './NotificationToast';
import './GamificationDashboard.css';

interface ImportedStep {
  date: string;
  steps: number;
}

export const GamificationDashboard: React.FC = () => {
  const { user, achievements, quests, avatarItems, notifications, processStepUpload, markNotificationAsRead } = useGamification();
  const [activeTab, setActiveTab] = useState<'stats' | 'achievements' | 'quests' | 'shop' | 'avatar'>('stats');
  const [stepsInput, setStepsInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [importedSteps, setImportedSteps] = useState<ImportedStep[]>([]);
  const [importError, setImportError] = useState<string | null>(null);

  // Simulate a connected wallet for local testing
  const address = "0xFAKEADDRESS1234567890";
  const isConnected = true;
  // Uncomment to use real wallet connection
  // const { address, isConnected } = useAccount();

  if (!user) {
    return (
      <div className="gamification-dashboard">
        <div className="dashboard-placeholder">
          <h2>🎮 Gamification System</h2>
          <p>Connect your wallet to start earning XP and rewards!</p>
        </div>
      </div>
    );
  }

  const xpProgress = calculateXPProgress(user.xp, user.level);
  const xpForNextLevel = Math.pow(user.level, 2) * 100;

  const handleStepUpload = () => {
    const steps = parseInt(stepsInput);
    if (isNaN(steps) || steps <= 0) return;

    setIsUploading(true);
    try {
      const result = processStepUpload(steps);
      // Show success message
      alert(`🎉 Steps uploaded successfully!\n+${result.xpGained} XP\n+${result.coinsGained} StepCoins\n${result.levelUp ? `🎊 Level Up! You're now level ${result.newLevel}!` : ''}\n${result.achievementsUnlocked.length > 0 ? `🏆 ${result.achievementsUnlocked.length} achievement(s) unlocked!` : ''}\n${result.questsCompleted.length > 0 ? `📋 ${result.questsCompleted.length} quest(s) completed!` : ''}`);
      setStepsInput('');
    } catch (error) {
      alert('Error uploading steps: ' + error);
    } finally {
      setIsUploading(false);
    }
  };

  // --- Import Steps Logic ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImportError(null);
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      try {
        const parsed = parseCSVSteps(text);
        setImportedSteps(parsed);
        setImportError(null);
      } catch (err: any) {
        setImportError('Could not parse file. Please ensure it is a valid CSV with date and steps columns.');
        setImportedSteps([]);
      }
    };
    reader.readAsText(file);
  };

  const parseCSVSteps = (csv: string): ImportedStep[] => {
    // Expecting CSV with headers: date,steps
    const lines = csv.trim().split(/\r?\n/);
    const header = lines[0].toLowerCase();
    if (!header.includes('date') || !header.includes('step')) {
      throw new Error('Missing required columns');
    }
    const dateIdx = header.split(',').findIndex(h => h.includes('date'));
    const stepsIdx = header.split(',').findIndex(h => h.includes('step'));
    return lines.slice(1).map(line => {
      const cols = line.split(',');
      return {
        date: cols[dateIdx],
        steps: parseInt(cols[stepsIdx])
      };
    }).filter(row => !isNaN(row.steps) && row.steps > 0);
  };

  const handleImportConfirm = () => {
    let importedCount = 0;
    importedSteps.forEach(row => {
      processStepUpload(row.steps);
      importedCount++;
    });
    setImportModalOpen(false);
    setImportedSteps([]);
    alert(`✅ Imported ${importedCount} days of steps!`);
  };

  const getRarityColor = (rarity: AchievementRarity): string => {
    switch (rarity) {
      case AchievementRarity.BRONZE: return '#cd7f32';
      case AchievementRarity.SILVER: return '#c0c0c0';
      case AchievementRarity.GOLD: return '#ffd700';
      case AchievementRarity.PLATINUM: return '#e5e4e2';
      case AchievementRarity.LEGENDARY: return '#ff6b35';
      default: return '#666';
    }
  };

  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const activeQuests = quests.filter(q => !q.completed);
  const completedQuests = quests.filter(q => q.completed);
  const ownedItems = avatarItems.filter(item => item.owned);
  const availableItems = avatarItems.filter(item => !item.owned);

  return (
    <>
      <NotificationContainer 
        notifications={notifications.filter(n => !n.read)}
        onClose={markNotificationAsRead}
      />
      
      <div className="gamification-dashboard">
        <div className="dashboard-header">
          <h2>🎮 Gamification Dashboard</h2>
          <div className="user-stats-summary">
            <div className="stat-item">
              <span className="stat-label">Level</span>
              <span className="stat-value">{user.level}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">XP</span>
              <span className="stat-value">{user.xp.toLocaleString()}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Coins</span>
              <span className="stat-value">{user.stepCoins}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Streak</span>
              <span className="stat-value">{user.currentStreak} 🔥</span>
            </div>
          </div>
        </div>

        <div className="step-upload-section">
          <h3>📊 Upload Your Steps</h3>
          <div className="upload-form">
            <input
              type="number"
              value={stepsInput}
              onChange={(e) => setStepsInput(e.target.value)}
              placeholder="Enter your steps for today"
              className="steps-input"
              min="0"
              max="999999"
            />
            <button
              onClick={handleStepUpload}
              disabled={isUploading || !stepsInput}
              className="upload-button"
            >
              {isUploading ? 'Uploading...' : '🚶‍♂️ Upload Steps'}
            </button>
            <button
              type="button"
              className="import-button"
              onClick={() => setImportModalOpen(true)}
              style={{ marginLeft: 8 }}
            >
              📥 Import Steps
            </button>
          </div>
        </div>

        {/* Import Steps Modal */}
        {importModalOpen && (
          <div className="import-modal-overlay">
            <div className="import-modal">
              <h3>📥 Import Steps from CSV</h3>
              <p>Upload a CSV file with <b>date</b> and <b>steps</b> columns.<br/>Example:<br/>date,steps<br/>2024-06-01,12345</p>
              <input type="file" accept=".csv" onChange={handleFileChange} />
              {importError && <div className="import-error">{importError}</div>}
              {importedSteps.length > 0 && (
                <>
                  <h4>Preview ({importedSteps.length} days):</h4>
                  <div className="import-preview-table-wrapper">
                    <table className="import-preview-table">
                      <thead>
                        <tr><th>Date</th><th>Steps</th></tr>
                      </thead>
                      <tbody>
                        {importedSteps.slice(0, 10).map((row, i) => (
                          <tr key={i}><td>{row.date}</td><td>{row.steps}</td></tr>
                        ))}
                        {importedSteps.length > 10 && (
                          <tr><td colSpan={2}>...and {importedSteps.length - 10} more</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  <button className="confirm-import-button" onClick={handleImportConfirm}>
                    ✅ Import {importedSteps.length} Days
                  </button>
                </>
              )}
              <button className="close-import-modal" onClick={() => setImportModalOpen(false)}>
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="dashboard-tabs">
          <button
            className={`tab-button ${activeTab === 'stats' ? 'active' : ''}`}
            onClick={() => setActiveTab('stats')}
          >
            📈 Stats
          </button>
          <button
            className={`tab-button ${activeTab === 'achievements' ? 'active' : ''}`}
            onClick={() => setActiveTab('achievements')}
          >
            🏆 Achievements
          </button>
          <button
            className={`tab-button ${activeTab === 'quests' ? 'active' : ''}`}
            onClick={() => setActiveTab('quests')}
          >
            📋 Quests
          </button>
          <button
            className={`tab-button ${activeTab === 'shop' ? 'active' : ''}`}
            onClick={() => setActiveTab('shop')}
          >
            🛒 Shop
          </button>
          <button
            className={`tab-button ${activeTab === 'avatar' ? 'active' : ''}`}
            onClick={() => setActiveTab('avatar')}
          >
            👤 Avatar
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'stats' && (
            <div className="stats-tab">
              <div className="level-progress">
                <h3>Level Progress</h3>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${xpProgress}%` }}
                  ></div>
                </div>
                <p>Level {user.level} • {user.xp.toLocaleString()} / {xpForNextLevel.toLocaleString()} XP</p>
              </div>

              <div className="stats-grid">
                <div className="stat-card">
                  <h4>Total Steps</h4>
                  <p className="stat-number">{user.totalSteps.toLocaleString()}</p>
                </div>
                <div className="stat-card">
                  <h4>Best Streak</h4>
                  <p className="stat-number">{user.bestStreak} days</p>
                </div>
                <div className="stat-card">
                  <h4>StepCoins</h4>
                  <p className="stat-number">{user.stepCoins}</p>
                </div>
                <div className="stat-card">
                  <h4>Join Date</h4>
                  <p className="stat-number">{user.joinDate.toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'achievements' && (
            <div className="achievements-tab">
              <div className="achievements-summary">
                <h3>Achievements ({unlockedAchievements.length}/{achievements.length})</h3>
              </div>
              
              <div className="achievements-grid">
                {achievements.map(achievement => (
                  <div 
                    key={achievement.id} 
                    className={`achievement-card ${achievement.unlocked ? 'unlocked' : 'locked'}`}
                    style={{ borderColor: getRarityColor(achievement.rarity) }}
                  >
                    <div className="achievement-icon">{achievement.icon}</div>
                    <div className="achievement-info">
                      <h4>{achievement.name}</h4>
                      <p>{achievement.description}</p>
                      <div className="achievement-rewards">
                        <span className="xp-reward">+{achievement.xpReward} XP</span>
                        <span className="coin-reward">+{achievement.coinReward} Coins</span>
                      </div>
                      {achievement.unlocked && (
                        <div className="unlock-date">
                          Unlocked: {achievement.unlockedAt?.toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'quests' && (
            <div className="quests-tab">
              <div className="quests-summary">
                <h3>Active Quests ({activeQuests.length})</h3>
              </div>
              
              <div className="quests-grid">
                {activeQuests.map(quest => (
                  <div key={quest.id} className="quest-card">
                    <div className="quest-header">
                      <h4>{quest.title}</h4>
                      <span className="quest-type">{quest.type}</span>
                    </div>
                    <p>{quest.description}</p>
                    <div className="quest-progress">
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{ width: `${(quest.current / quest.target) * 100}%` }}
                        ></div>
                      </div>
                      <span>{quest.current} / {quest.target}</span>
                    </div>
                    <div className="quest-rewards">
                      <span>+{quest.reward.xp} XP</span>
                      <span>+{quest.reward.coins} Coins</span>
                    </div>
                  </div>
                ))}
              </div>

              {completedQuests.length > 0 && (
                <div className="completed-quests">
                  <h3>Completed Quests ({completedQuests.length})</h3>
                  <div className="quests-grid">
                    {completedQuests.map(quest => (
                      <div key={quest.id} className="quest-card completed">
                        <div className="quest-header">
                          <h4>{quest.title} ✅</h4>
                          <span className="quest-type">{quest.type}</span>
                        </div>
                        <p>{quest.description}</p>
                        <div className="quest-completion">
                          Completed: {quest.completedAt?.toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'shop' && (
            <div className="shop-tab">
              <div className="shop-header">
                <h3>Avatar Shop</h3>
                <p>Spend your StepCoins to customize your avatar!</p>
              </div>
              
              <div className="shop-grid">
                {availableItems.map(item => (
                  <div key={item.id} className="shop-item">
                    <div className="item-icon">{item.image}</div>
                    <div className="item-info">
                      <h4>{item.name}</h4>
                      <p className="item-type">{item.type}</p>
                      <div className="item-price">
                        <span className="price">{item.price} StepCoins</span>
                      </div>
                    </div>
                    <button 
                      className="purchase-button"
                      disabled={user.stepCoins < item.price}
                      onClick={() => {
                        if (user.stepCoins >= item.price) {
                          // Purchase logic would go here
                          alert(`Purchased ${item.name} for ${item.price} StepCoins!`);
                        }
                      }}
                    >
                      {user.stepCoins >= item.price ? 'Purchase' : 'Not Enough Coins'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'avatar' && (
            <div className="avatar-tab">
              <div className="avatar-preview">
                <h3>Your Avatar</h3>
                <div className="avatar-display">
                  <div className="avatar-character">
                    {ownedItems.filter(item => item.equipped).map(item => (
                      <span key={item.id} className="equipped-item">{item.image}</span>
                    ))}
                    {ownedItems.filter(item => item.equipped).length === 0 && (
                      <span className="default-avatar">👤</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="owned-items">
                <h3>Your Items ({ownedItems.length})</h3>
                <div className="items-grid">
                  {ownedItems.map(item => (
                    <div key={item.id} className="owned-item">
                      <div className="item-icon">{item.image}</div>
                      <div className="item-info">
                        <h4>{item.name}</h4>
                        <p className="item-type">{item.type}</p>
                      </div>
                      <button 
                        className={`equip-button ${item.equipped ? 'equipped' : ''}`}
                        onClick={() => {
                          // Equip logic would go here
                          alert(`${item.equipped ? 'Unequipped' : 'Equipped'} ${item.name}!`);
                        }}
                      >
                        {item.equipped ? 'Unequip' : 'Equip'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}; 