

export interface UpgradeStats {
  id: 'power' | 'economy' | 'catapult' | 'ball';
  name: string;
  description: string;
  level: number;
  baseCost: number;
  costMultiplier: number;
  effectMultiplier: number; // How much the stat increases per level
  maxLevel?: number;
}

export interface OmegaUpgrade {
  id: 'gravity_dampener' | 'gem_finder' | 'offline_earnings';
  name: string;
  description: string;
  level: number;
  maxLevel: number;
  baseMoneyCost: number;
  baseGemCost: number;
  effect: number; // percentage or flat value
}

export interface Structure {
  id: 'mission_control' | 'launch_gantry' | 'xeno_lab';
  name: string;
  description: string;
  level: number;
  maxLevel: number;
  baseCost: number;
  costMultiplier: number;
  effectDescription: string;
  isConstructing?: boolean; // For animation state
  constructionProgress?: number; // 0-100
}

export type Rarity = 'Common' | 'Rare' | 'Epic' | 'Legendary' | '???';

export interface TimeShopItem {
  id: string;
  name: string;
  description: string;
  rarity: Rarity;
  cost: number;
  type: 'cash' | 'power_level' | 'economy_level';
  value: number; 
}

export type WorldTheme = 'Earth' | 'Mars' | 'Neon' | 'Void';

export interface DropItem {
  id: string;
  y: number;
  x: number; // relative percentage or pixel offset
  type: 'money' | 'gem' | 'asteroid';
  value: number;
}

export interface Hazard {
  id: string;
  y: number;
  x: number; // 0-100%
  type: 'bird' | 'collectable' | 'jet';
  velocity: number; // speed and direction
  warningTick: number; // frames until spawn
}

export interface Airdrop {
  id: string;
  x: number; // 0-100%
  y: number;
  vy: number;
  isLanded: boolean;
}

export interface RareEventEntity {
  id: string;
  type: 'golden_comet' | 'gem_drone';
  x: number;
  y: number;
  vx: number;
}

export interface InventoryItem {
  id: string;
  name: string; 
  rarity: Rarity;
  value: number;
  category: 'asteroid' | 'collectable';
  date: number;
}

export interface LogMessage {
  id: string;
  text: string;
  type: 'info' | 'success' | 'warning' | 'danger' | 'glitch';
  timestamp: number;
}

export interface ManagerState {
  hired: boolean;
  level: number; // Controls gems per 10s
  name: string;
  lastGemClaim: number;
}

export interface DetailedStats {
    totalGemsEarned: number;
    itemsFound: number;
    hazardsHit: number;
    airdropsCollected: number;
    timePlayed: number; // seconds
    rareEventsFound: number;
}

export interface ChatMessage {
    id: string;
    sender: string;
    text: string;
    timestamp: number;
    isSystem?: boolean;
}

export interface FlyingResource {
    id: string;
    type: 'money' | 'gems';
    value: number;
    startX: number;
    startY: number; // Screen coordinates (px)
    currentX: number;
    currentY: number;
    targetX: number; // UI counter location
    targetY: number;
    progress: number; // 0 to 1
}

export interface GameState {
  money: number;
  gems: number;
  likes: number; // New likes counter
  hasLiked: boolean; // Tracks if user has already liked
  username: string; // Player username
  chatHistory: ChatMessage[]; // Chat history
  lifetimeEarnings: number;
  highScore: number;
  totalLaunches: number;
  maxHeight: number; 
  recordHeight: number; 
  reachedMilestones: number[]; // Track which heights have been triggered
  upgrades: {
    power: UpgradeStats;
    economy: UpgradeStats;
    catapult: UpgradeStats; // Visual + Multiplier
    ball: UpgradeStats; // Visual + Drag reduction
  };
  omega: {
    gravity_dampener: OmegaUpgrade;
    gem_finder: OmegaUpgrade;
  };
  structures: {
      mission_control: Structure;
      launch_gantry: Structure;
      xeno_lab: Structure;
  };
  manager: ManagerState;
  detailedStats: DetailedStats;
  screen: 'TITLE' | 'GAME';
  currentWorld: WorldTheme;
  unlockedWorlds: WorldTheme[];
  timeShop: {
    nextRefresh: number;
    item: TimeShopItem | null;
  };
  nextMassiveUpgrade: number; // Timestamp for the 10-minute event
  tutorialStep: number; // 0: None/Done, 1: Launch, 2: In-Air, 3: Shop/Upgrade
  permanentMultipliers: {
    money: number;
  };
  inventory: InventoryItem[];
  logs: LogMessage[];
  systemDamage: boolean;
  redeemedCodes: string[]; // New: Track redeemed codes
}

export interface BallPhysics {
  x: number; 
  y: number; 
  vy: number; 
  isLaunched: boolean;
  peakHeight: number;
}

export enum GamePhase {
  IDLE = 'IDLE',
  FLYING = 'FLYING',
  LANDED = 'LANDED'
}