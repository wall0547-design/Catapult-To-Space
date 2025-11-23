

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GameState, BallPhysics, TimeShopItem, Rarity, DropItem, Hazard, InventoryItem, LogMessage, WorldTheme, Airdrop, OmegaUpgrade, RareEventEntity, ChatMessage, FlyingResource } from './types';
import { INITIAL_POWER_UPGRADE, INITIAL_ECONOMY_UPGRADE, INITIAL_CATAPULT_UPGRADE, INITIAL_BALL_UPGRADE, INITIAL_OMEGA_GRAVITY, INITIAL_OMEGA_GEM, INITIAL_STRUCTURES, GRAVITY, BALL_SIZE, GOAL_HEIGHT, TIME_SHOP_INTERVAL, BASE_ASTEROID_VALUE, CARGO_ITEMS, WORLD_MULTIPLIERS, MASSIVE_UPGRADE_INTERVAL, MANAGER_GEM_INTERVAL, MANAGER_HIRE_COST, MANAGER_UPGRADE_COST_BASE, MANAGER_UPGRADE_COST_MULT, MILESTONES } from './constants';
import { Background } from './components/Background';
import { Shop } from './components/Shop';
import { TitleScreen } from './components/TitleScreen';
import { MapModal } from './components/MapModal';
import { TimeShopModal } from './components/TimeShopModal';
import { WorldsModal } from './components/WorldsModal';
import { GemShop } from './components/GemShop';
import { TutorialOverlay } from './components/TutorialOverlay';
import { ControlTower } from './components/ControlTower';
import { ControlTowerModal } from './components/ControlTowerModal';
import { InventoryModal } from './components/InventoryModal';
import { SpinWheelModal } from './components/SpinWheelModal';
import { CosmicEventModal } from './components/CosmicEventModal';
import { ManagerModal } from './components/ManagerModal';
import { PrizeModal } from './components/PrizeModal';
import { StatsModal } from './components/StatsModal';
import { ChatModal } from './components/ChatModal';
import { BuildModal } from './components/BuildModal';
import { CodesModal } from './components/CodesModal';
import { CrateModal } from './components/CrateModal';
import { MilestoneModal } from './components/MilestoneModal';
import { Rocket, ShoppingCart, Map as MapIcon, Clock, Globe, Diamond, Package, AlertTriangle, Bird, Box, DollarSign as DollarIcon, ArrowDown, Star, CircleDot, Save, Infinity, Briefcase, BarChart3, Zap, Heart, MessageCircle, Users, Hammer, Terminal, Plane, Gift } from 'lucide-react';

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
}

const SAVE_KEY = 'catapult_space_save_v2';
const CARTOON_MONEY_IMG = "https://cdn-icons-png.flaticon.com/512/2454/2454269.png";

// Simulated "Real" Users
const BOT_NAMES = [
    "StarLord_99", "CosmicKate", "ElonMuskrat", "MoonWalker", "NasaFanboy", 
    "GalacticGary", "VoidRunner", "AstroPhysicist", "RocketGirl", "SpaceOddity",
    "Jebediah", "OrbitBreaker", "ZeroG_Warrior", "NebulaSurfer"
];

const BOT_MESSAGES = [
    "Anyone reached the Moon yet?",
    "I just got a legendary cargo drop!",
    "Upgrade your money stats first guys.",
    "The void level looks so cool.",
    "My catapult is creaking...",
    "Just passed 50k ft!",
    "How do I get more gems?",
    "Don't forget to check the time shop.",
    "Launch power level 50 is insane.",
    "Has anyone seen the golden comet?",
    "Hit a bird lol",
    "My manager is slacking off...",
    "Anyone wanna trade asteroids?",
    "Ground control to major tom..."
];

const App: React.FC = () => {
  // --- State ---
  const [gameState, setGameState] = useState<GameState>({
    money: 0,
    gems: 0,
    likes: 0,
    hasLiked: false,
    username: 'Guest',
    chatHistory: [],
    lifetimeEarnings: 0,
    highScore: 0,
    totalLaunches: 0,
    maxHeight: 0,
    recordHeight: 0,
    reachedMilestones: [],
    upgrades: {
      power: INITIAL_POWER_UPGRADE,
      economy: INITIAL_ECONOMY_UPGRADE,
      catapult: INITIAL_CATAPULT_UPGRADE,
      ball: INITIAL_BALL_UPGRADE
    },
    omega: {
      gravity_dampener: INITIAL_OMEGA_GRAVITY,
      gem_finder: INITIAL_OMEGA_GEM
    },
    structures: INITIAL_STRUCTURES,
    manager: {
        hired: false,
        level: 1,
        name: 'Director Kael',
        lastGemClaim: Date.now(),
    },
    detailedStats: {
        totalGemsEarned: 0,
        itemsFound: 0,
        hazardsHit: 0,
        airdropsCollected: 0,
        timePlayed: 0,
        rareEventsFound: 0
    },
    screen: 'TITLE',
    currentWorld: 'Earth',
    unlockedWorlds: ['Earth'],
    timeShop: {
      nextRefresh: Date.now() + TIME_SHOP_INTERVAL,
      item: null
    },
    nextMassiveUpgrade: Date.now() + MASSIVE_UPGRADE_INTERVAL,
    tutorialStep: 0,
    permanentMultipliers: {
      money: 1,
    },
    inventory: [],
    logs: [],
    systemDamage: false,
    redeemedCodes: [],
  });

  const [ball, setBall] = useState<BallPhysics>({
    x: 50,
    y: 0,
    vy: 0,
    isLaunched: false,
    peakHeight: 0
  });

  const [drops, setDrops] = useState<DropItem[]>([]);
  const [hazards, setHazards] = useState<Hazard[]>([]);
  const [airdrops, setAirdrops] = useState<Airdrop[]>([]);
  const [rareEvents, setRareEvents] = useState<RareEventEntity[]>([]);
  const [flyingResources, setFlyingResources] = useState<FlyingResource[]>([]);
  
  const [megaBoostActive, setMegaBoostActive] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [planetEncounter, setPlanetEncounter] = useState<{active: boolean, y: number} | null>(null);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [cosmicTimeLeft, setCosmicTimeLeft] = useState('');
  const [onlineUsers, setOnlineUsers] = useState(420);

  const [modals, setModals] = useState({
    shop: false,
    timeShop: false,
    map: false,
    worlds: false,
    gemShop: false,
    inventory: false,
    controlTower: false,
    spinWheel: false,
    cosmicEvent: false,
    manager: false,
    stats: false,
    chat: false,
    build: false,
    codes: false,
    crate: false,
  });

  const [milestoneModal, setMilestoneModal] = useState<{open: boolean, height: number, reward: number, message: string}>({
      open: false,
      height: 0,
      reward: 0,
      message: ''
  });

  const [prizeModal, setPrizeModal] = useState<{
      open: boolean;
      title: string;
      message: string;
      type: 'money' | 'gems' | 'power' | 'economy' | 'item';
  }>({
      open: false,
      title: '',
      message: '',
      type: 'money'
  });

  // Refs
  const ballRef = useRef<BallPhysics>(ball);
  const requestRef = useRef<number | null>(null);
  const gameStateRef = useRef<GameState>(gameState);
  const dropsRef = useRef<DropItem[]>(drops);
  const hazardsRef = useRef<Hazard[]>(hazards);
  const airdropsRef = useRef<Airdrop[]>(airdrops);
  const rareEventsRef = useRef<RareEventEntity[]>(rareEvents);
  const flyingResourcesRef = useRef<FlyingResource[]>(flyingResources);
  const lastDropSpawnHeightRef = useRef<number>(0);
  const modalsRef = useRef(modals);
  const milestoneModalRef = useRef(milestoneModal);
  const chatChannelRef = useRef<BroadcastChannel | null>(null);
  const lastJetSpawnRef = useRef<number>(Date.now());

  // Sync refs
  useEffect(() => { ballRef.current = ball; }, [ball]);
  useEffect(() => { gameStateRef.current = gameState; }, [gameState]);
  useEffect(() => { dropsRef.current = drops; }, [drops]);
  useEffect(() => { hazardsRef.current = hazards; }, [hazards]);
  useEffect(() => { airdropsRef.current = airdrops; }, [airdrops]);
  useEffect(() => { rareEventsRef.current = rareEvents; }, [rareEvents]);
  useEffect(() => { flyingResourcesRef.current = flyingResources; }, [flyingResources]);
  useEffect(() => { modalsRef.current = modals; }, [modals]);
  useEffect(() => { milestoneModalRef.current = milestoneModal; }, [milestoneModal]);

  // --- Helper: Logging ---
  const addLog = useCallback((text: string, type: LogMessage['type'] = 'info') => {
      const newLog: LogMessage = {
          id: Date.now().toString() + Math.random(),
          text,
          type,
          timestamp: Date.now()
      };
      setGameState(prev => ({
          ...prev,
          logs: [...prev.logs, newLog].slice(-10) // Keep last 10
      }));
  }, []);

  // --- Helper: Spawn Flying Resource ---
  const spawnFlyingResource = useCallback((value: number, type: 'money' | 'gems', startX: number, startY: number) => {
      // Calculate target based on UI position (approximate top right)
      // Money: Right side, ~40px down
      // Gems: Right side, ~80px down
      const targetX = window.innerWidth - 80;
      const targetY = type === 'money' ? 40 : 80;

      const resource: FlyingResource = {
          id: Date.now().toString() + Math.random(),
          type,
          value,
          startX,
          startY,
          currentX: startX,
          currentY: startY,
          targetX,
          targetY,
          progress: 0
      };

      setFlyingResources(prev => [...prev, resource]);
  }, []);

  // --- Helper: Add Chat ---
  const addChatMessage = useCallback((sender: string, text: string, isSystem: boolean = false) => {
      const newMsg: ChatMessage = {
          id: Date.now().toString() + Math.random(),
          sender,
          text,
          timestamp: Date.now(),
          isSystem
      };
      setGameState(prev => ({
          ...prev,
          chatHistory: [...prev.chatHistory, newMsg].slice(-50)
      }));
  }, []);

  // --- Multiplayer Simulation (BroadcastChannel + Bots) ---
  useEffect(() => {
      // 1. Setup Broadcast Channel for Cross-Tab "Multiplayer"
      const channel = new BroadcastChannel('space_catapult_global_chat');
      chatChannelRef.current = channel;

      channel.onmessage = (event) => {
          if (event.data && event.data.type === 'chat') {
              addChatMessage(event.data.sender, event.data.text);
          }
      };

      // 2. Initial "Welcome"
      setTimeout(() => {
          addChatMessage('System', `Connected to Global Server (Region: US-East)`, true);
          addChatMessage('System', `${onlineUsers} Pilots Online`, true);
      }, 1000);

      // 3. Online User Fluctuation
      const userInterval = setInterval(() => {
          setOnlineUsers(prev => {
              const change = Math.floor(Math.random() * 5) - 2;
              return Math.max(100, prev + change);
          });
      }, 5000);

      return () => {
          channel.close();
          clearInterval(userInterval);
      };
  }, [addChatMessage]);

  // --- Username Generation ---
  useEffect(() => {
      if (gameState.username === 'Guest') {
          const prefixes = ['Pilot', 'Captain', 'Rookie', 'Commander', 'Ace', 'Voyager'];
          const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
          const num = Math.floor(Math.random() * 9999);
          const newName = `${prefix}-${num}`;
          setGameState(prev => ({ ...prev, username: newName }));
      }
  }, []);


  // --- Saving System ---
  
  // Load Game on Mount
  useEffect(() => {
      const savedData = localStorage.getItem(SAVE_KEY);
      if (savedData) {
          try {
              const parsed = JSON.parse(savedData);
              // Deep merge logic to prevent crashing on schema updates
              setGameState(prev => ({
                  ...prev,
                  ...parsed,
                  upgrades: { ...prev.upgrades, ...parsed.upgrades },
                  omega: { ...prev.omega, ...parsed.omega },
                  structures: { ...INITIAL_STRUCTURES, ...parsed.structures }, // Merge structures
                  manager: { ...prev.manager, ...parsed.manager }, 
                  detailedStats: { ...prev.detailedStats, ...parsed.detailedStats }, 
                  permanentMultipliers: { ...prev.permanentMultipliers, ...parsed.permanentMultipliers },
                  chatHistory: [], // Reset chat history on reload, fetch fresh
                  likes: parsed.likes || 0,
                  hasLiked: parsed.hasLiked || false,
                  redeemedCodes: parsed.redeemedCodes || [],
                  reachedMilestones: parsed.reachedMilestones || [], // Load milestones
                  screen: 'TITLE' // Always start on title
              }));
              addLog("Save data loaded successfully.", 'success');
          } catch (e) {
              console.error("Failed to load save", e);
              addLog("Save data corrupted. Starting new simulation.", 'danger');
          }
      }
  }, []);

  // Auto-Save Loop (Every 30s)
  useEffect(() => {
      const interval = setInterval(() => {
          saveGame();
      }, 30000);
      return () => clearInterval(interval);
  }, []);

  // Save on Exit (Before Unload)
  useEffect(() => {
      const handleUnload = () => {
          localStorage.setItem(SAVE_KEY, JSON.stringify(gameStateRef.current));
      };
      window.addEventListener('beforeunload', handleUnload);
      return () => {
          window.removeEventListener('beforeunload', handleUnload);
      };
  }, []);

  const saveGame = () => {
      setIsAutoSaving(true);
      localStorage.setItem(SAVE_KEY, JSON.stringify(gameStateRef.current));
      setTimeout(() => setIsAutoSaving(false), 1000);
  };

  // --- Helper: Particles ---
  const spawnParticles = (x: number, y: number, count: number = 8, color: string = 'bg-white') => {
      const newParticles: Particle[] = [];
      for(let i=0; i<count; i++) {
          newParticles.push({
              id: Date.now() + Math.random(),
              x,
              y,
              color
          });
      }
      setParticles(prev => [...prev, ...newParticles]);
      
      // Cleanup particles after animation
      setTimeout(() => {
          setParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id)));
      }, 1000);
  };

  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement | HTMLDivElement>, color: string = 'bg-white') => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX;
      const y = e.clientY;
      spawnParticles(x, y, 8, color);
  };


  // --- Tutorial Logic ---
  const startTutorial = () => {
      setGameState(prev => ({
          ...prev,
          screen: 'GAME',
          tutorialStep: 1 // Step 1: Point to Launch
      }));
      addLog("Welcome Pilot. Initialize Launch Sequence.", 'info');
  };

  // --- Helper: Generate Cargo Item ---
  const generateCargoItem = (type: 'collectable' | 'asteroid'): InventoryItem => {
      const labMultiplier = 1 + (gameStateRef.current.structures.xeno_lab.level); // Xeno Lab increases value

      if (type === 'collectable') {
        const randomIndex = Math.floor(Math.random() * CARGO_ITEMS.length);
        const itemTemplate = CARGO_ITEMS[randomIndex];
        const variance = 0.9 + Math.random() * 0.2; 
        const finalValue = Math.floor(itemTemplate.baseValue * variance * labMultiplier);

        return {
            id: Date.now().toString() + Math.random(),
            name: itemTemplate.name,
            rarity: itemTemplate.rarity,
            value: finalValue,
            category: 'collectable',
            date: Date.now()
        };
      } else {
        const rarityRoll = Math.random();
        let rarity: Rarity = 'Common';
        let baseVal = 5000;
        if (rarityRoll > 0.98) { rarity = 'Legendary'; baseVal = 500000; }
        else if (rarityRoll > 0.9) { rarity = 'Epic'; baseVal = 100000; }
        else if (rarityRoll > 0.7) { rarity = 'Rare'; baseVal = 25000; }

        return {
            id: Date.now().toString() + Math.random(),
            name: 'Unidentified Asteroid',
            rarity: rarity,
            value: Math.floor((baseVal + Math.floor(Math.random() * baseVal * 0.5)) * labMultiplier),
            category: 'asteroid',
            date: Date.now()
        };
      }
  };


  // --- Airdrop Spawner ---
  useEffect(() => {
      if (gameState.screen !== 'GAME') return;

      const interval = setInterval(() => {
          if (Object.values(modalsRef.current).some(v => v) || milestoneModalRef.current.open) return; // Pause if modal open
          
          if (Math.random() < 0.3) { 
              const viewportHeight = window.innerHeight;
              const spawnY = ballRef.current.y + viewportHeight + 100;
              
              const newAirdrop: Airdrop = {
                  id: Date.now().toString() + Math.random(),
                  x: 10 + Math.random() * 80, 
                  y: spawnY,
                  vy: -1.5,
                  isLanded: false
              };
              setAirdrops(prev => [...prev, newAirdrop]);
              addLog("Supply Drop detected inbound.", 'info');
          }
      }, 10000); 

      return () => clearInterval(interval);
  }, [gameState.screen, addLog]);


  // --- Chat Simulation & Timers ---
  useEffect(() => {
      const interval = setInterval(() => {
          if (gameState.screen !== 'GAME') return;
          if (Object.values(modalsRef.current).some(v => v) || milestoneModalRef.current.open) return; // Pause if modal open
          
          // 1. Simulate Bot Messages
          if (Math.random() < 0.08) { // 8% chance per second
               const msgText = BOT_MESSAGES[Math.floor(Math.random() * BOT_MESSAGES.length)];
               const botName = BOT_NAMES[Math.floor(Math.random() * BOT_NAMES.length)];
               addChatMessage(botName, msgText);
          }

      }, 1000);
      return () => clearInterval(interval);
  }, [gameState.screen, addChatMessage]);

  // --- React to Player Achievements ---
  useEffect(() => {
      if (gameState.recordHeight > 0 && gameState.recordHeight % 10000 < 100 && gameState.recordHeight > 5000) {
           const botName = BOT_NAMES[Math.floor(Math.random() * BOT_NAMES.length)];
           addChatMessage(botName, `Woah, nice height ${gameState.username}!`);
      }
  }, [gameState.recordHeight, gameState.username, addChatMessage]);


  // --- Time Shop Logic, Rare Events & Timers ---
  const generateTimeShopItem = useCallback(() => {
    const rand = Math.random();
    let rarity: Rarity = 'Common';
    if (rand > 0.98) rarity = '???';
    else if (rand > 0.90) rarity = 'Legendary';
    else if (rand > 0.75) rarity = 'Epic';
    else if (rand > 0.50) rarity = 'Rare';

    const baseCost = 50 + (gameStateRef.current.lifetimeEarnings * 0.05);
    let cost = baseCost;
    let type: TimeShopItem['type'] = 'cash';
    let value = 0;

    switch(rarity) {
      case 'Common': 
        cost *= 0.5; 
        value = 100 + (gameStateRef.current.upgrades.economy.level * 50);
        break;
      case 'Rare': 
        cost *= 1.5; 
        value = 500 + (gameStateRef.current.upgrades.economy.level * 200);
        break;
      case 'Epic': 
        cost *= 5; 
        type = Math.random() > 0.5 ? 'power_level' : 'economy_level';
        value = 1;
        break;
      case 'Legendary': 
        cost *= 20; 
        value = 50000;
        break;
      case '???': 
        cost = 0; 
        value = 1000000;
        break;
    }

    const item: TimeShopItem = {
      id: Date.now().toString(),
      name: `${rarity} Crate`,
      description: type === 'cash' ? `Contains a stash of money.` : `Instantly upgrades a system.`,
      rarity,
      cost: Math.floor(cost),
      type,
      value
    };

    setGameState(prev => ({
      ...prev,
      timeShop: {
        nextRefresh: Date.now() + TIME_SHOP_INTERVAL,
        item
      }
    }));
    
  }, []);

  // Timers Loop
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const gs = gameStateRef.current;
      
      if (gs.screen !== 'GAME') return;
      if (Object.values(modalsRef.current).some(v => v) || milestoneModalRef.current.open) return; // Pause timers if modal open

      // Stats: Time Played
      setGameState(prev => ({
          ...prev,
          detailedStats: {
              ...prev.detailedStats,
              timePlayed: (prev.detailedStats?.timePlayed || 0) + 1
          }
      }));

      // Structure Passive Income (Mission Control)
      if (gs.structures.mission_control.level > 0 && gs.recordHeight > 0) {
          const passiveIncome = Math.floor(10 * gs.structures.mission_control.level * (gs.recordHeight / 1000));
          if (passiveIncome > 0) {
            setGameState(prev => ({
                ...prev,
                money: prev.money + passiveIncome,
            }));
            // Optional: Small popup for passive income? Maybe too noisy.
          }
      }
      
      // Structure Construction Logic (Animation Handler)
      // Handled in separate effect below

      // Time Shop Refresh
      if (now >= gs.timeShop.nextRefresh) {
        generateTimeShopItem();
      }

      // Cosmic Event Check (10 Mins)
      if (now >= (gs.nextMassiveUpgrade || 0) && !modals.cosmicEvent) {
          setModals(prev => ({ ...prev, cosmicEvent: true }));
      }
      
      // Manager Gem Production
      if (gs.manager && gs.manager.hired && now > gs.manager.lastGemClaim + MANAGER_GEM_INTERVAL) {
           setGameState(prev => ({
               ...prev,
               gems: prev.gems + prev.manager.level,
               detailedStats: {
                   ...prev.detailedStats,
                   totalGemsEarned: (prev.detailedStats?.totalGemsEarned || 0) + prev.manager.level
               },
               manager: {
                   ...prev.manager,
                   lastGemClaim: now
               }
           }));
      }

      // RARE EVENTS SPAWNER
      // 0.5% chance per second for event
      if (Math.random() < 0.005) {
          const type = Math.random() > 0.7 ? 'golden_comet' : 'gem_drone';
          const newEvent: RareEventEntity = {
              id: Date.now().toString(),
              type,
              x: type === 'golden_comet' ? -10 : 110, // Start off screen
              y: 100 + Math.random() * (window.innerHeight - 300),
              vx: type === 'golden_comet' ? 3 : -4 // Move direction
          };
          setRareEvents(prev => [...prev, newEvent]);
          addLog(type === 'golden_comet' ? "ANOMALY DETECTED: GOLDEN ENERGY SIGNATURE" : "Drone signal detected nearby.", 'warning');
      }

      // Jumbo Jet Spawner (Every 1 minute)
      if (now - lastJetSpawnRef.current > 60000) {
          // Spawn jet between 2,000 and 50,000 ft
          const spawnY = 2000 + Math.random() * 48000;
          const newJet: Hazard = {
              id: Date.now().toString() + '_jet',
              y: spawnY,
              x: -10,
              type: 'jet',
              velocity: 2, // Slow horizontal movement
              warningTick: 0
          };
          setHazards(prev => [...prev, newJet]);
          lastJetSpawnRef.current = now;
          addLog("Jumbo Jet detected in airspace!", 'info');
      }

      // Update Cosmic Timer String
      const cosmicDiff = Math.max(0, (gs.nextMassiveUpgrade || 0) - now);
      const cm = Math.floor(cosmicDiff / 60000);
      const cs = Math.floor((cosmicDiff % 60000) / 1000);
      setCosmicTimeLeft(`${cm}:${cs.toString().padStart(2, '0')}`);

    }, 1000);
    
    if (!gameState.timeShop.item) {
        generateTimeShopItem();
    }

    return () => clearInterval(interval);
  }, [generateTimeShopItem, modals.cosmicEvent, gameState.screen, addLog]);

  // --- Construction Loop (50ms) ---
  useEffect(() => {
      const interval = setInterval(() => {
          const gs = gameStateRef.current;
          let needsUpdate = false;
          const updates: any = {};

          ['mission_control', 'launch_gantry', 'xeno_lab'].forEach((key) => {
             const k = key as keyof typeof gs.structures;
             if (gs.structures[k].isConstructing) {
                 const current = gs.structures[k].constructionProgress || 0;
                 if (current < 100) {
                     needsUpdate = true;
                     // 0.5% per 50ms = 10% per second = 10 seconds total duration (Slower build)
                     updates[k] = { ...gs.structures[k], constructionProgress: current + 0.5 }; 
                 } else {
                     needsUpdate = true;
                     updates[k] = { ...gs.structures[k], constructionProgress: 0, isConstructing: false, level: gs.structures[k].level + 1 };
                     addLog(`Construction Complete: ${gs.structures[k].name} Level ${gs.structures[k].level + 1}`, 'success');
                 }
             }
          });

          if (needsUpdate) {
              setGameState(prev => ({
                  ...prev,
                  structures: { ...prev.structures, ...updates }
              }));
          }
      }, 50); // 50ms tick
      return () => clearInterval(interval);
  }, [addLog]);

  const handleClaimCosmicEvent = () => {
      setGameState(prev => ({
          ...prev,
          permanentMultipliers: {
              ...prev.permanentMultipliers,
              money: prev.permanentMultipliers.money * 2
          },
          nextMassiveUpgrade: Date.now() + MASSIVE_UPGRADE_INTERVAL
      }));
      setModals(prev => ({ ...prev, cosmicEvent: false }));
      addLog("COSMIC POWER ASSIMILATED. x2 EARNINGS.", 'glitch');
      saveGame(); 
  };


  // --- Main Physics Engine ---
  const updatePhysics = useCallback(() => {
    // PAUSE GAME LOOP IF ANY MODAL IS OPEN
    if (Object.values(modalsRef.current).some(v => v) || milestoneModalRef.current.open) {
        requestRef.current = requestAnimationFrame(updatePhysics);
        return;
    }

    const currentGS = gameStateRef.current;
    
    // --- Flying Resources Logic ---
    if (flyingResourcesRef.current.length > 0) {
        let activeResources = flyingResourcesRef.current.map(res => {
            // Lerp towards target
            const dx = res.targetX - res.currentX;
            const dy = res.targetY - res.currentY;
            
            // Speed factor
            const speed = 0.03; // Much slower
            const nextX = res.currentX + dx * speed;
            const nextY = res.currentY + dy * speed;
            
            // Progress tracker
            const dist = Math.sqrt(dx*dx + dy*dy);
            
            return {
                ...res,
                currentX: nextX,
                currentY: nextY,
                dist // Store for filtering
            };
        });

        const landedResources = activeResources.filter(r => r.dist < 20);
        activeResources = activeResources.filter(r => r.dist >= 20);

        setFlyingResources(activeResources);

        if (landedResources.length > 0) {
            setGameState(prev => {
                let newMoney = prev.money;
                let newGems = prev.gems;
                let stats = { ...prev.detailedStats };

                landedResources.forEach(r => {
                    if (r.type === 'money') {
                        newMoney += r.value;
                    } else if (r.type === 'gems') {
                        newGems += r.value;
                        stats.totalGemsEarned += r.value;
                    }
                });

                return {
                    ...prev,
                    money: newMoney,
                    gems: newGems,
                    detailedStats: stats
                };
            });
        }
    }

    // --- Ball Physics (Only if launched) ---
    if (ballRef.current.isLaunched) {
        const currentBall = ballRef.current;
        const gravityMod = 1 - (currentGS.omega.gravity_dampener.level * currentGS.omega.gravity_dampener.effect);
        const ballDragMod = 1 - (currentGS.upgrades.ball.level * currentGS.upgrades.ball.effectMultiplier); 
        const drag = 0.001 * (1 - ballDragMod); 

        let newVy = currentBall.vy - (GRAVITY * gravityMod);
        newVy = newVy * (1 - drag); 

        let newY = currentBall.y + newVy;
        let newPeak = Math.max(currentBall.peakHeight, newY);

        // --- Milestone Check ---
        MILESTONES.forEach(ms => {
            if (newY >= ms.height && !currentGS.reachedMilestones.includes(ms.height)) {
                // Trigger Milestone
                setMilestoneModal({
                    open: true,
                    height: ms.height,
                    reward: ms.rewardMoney,
                    message: ms.message
                });
                
                setGameState(prev => ({
                    ...prev,
                    reachedMilestones: [...prev.reachedMilestones, ms.height]
                }));
            }
        });

        // --- Planet Smash Event ---
        if (!currentGS.systemDamage && newY > 15000 && newVy > 10) {
            if (Math.random() < 0.002) {
                setPlanetEncounter({
                    active: true,
                    y: newY + 1000
                });
                addLog("ALERT: MASSIVE OBJECT DETECTED!", 'warning');
                setTimeout(() => {
                    addLog("IMPACT CONFIRMED. SYSTEMS CRITICAL.", 'glitch');
                    setGameState(prev => ({...prev, systemDamage: true}));
                }, 500);
            }
        }

        // --- Continuous Collision Detection for Landing ---
        // If physics calculates we went below 0, catch it immediately before render
        if (newY <= 0) {
            newY = 0;
            newVy = 0;
            
            const economy = gameStateRef.current.upgrades.economy;
            const heightBonus = Math.floor(currentBall.peakHeight / 500);
            let baseIncome = economy.level * economy.effectMultiplier; 
            let income = (baseIncome + heightBonus) * gameStateRef.current.permanentMultipliers.money;
            income *= WORLD_MULTIPLIERS[gameStateRef.current.currentWorld];
            income *= (1 + (gameStateRef.current.upgrades.catapult.level * gameStateRef.current.upgrades.catapult.effectMultiplier));
            
            // Launch Gantry Bonus
            const gantryBonus = 1 + (gameStateRef.current.structures.launch_gantry.level * 0.5);
            income *= gantryBonus;

            income = Math.max(1, Math.floor(income));

            // Instead of immediate add, Spawn Resource
            spawnFlyingResource(income, 'money', window.innerWidth / 2, window.innerHeight - 100);

            setGameState(prev => {
                const newLifetime = prev.lifetimeEarnings + income;
                const newHighScore = Math.max(prev.highScore, income);
                const newRecordHeight = Math.max(prev.recordHeight, currentBall.peakHeight);
                let nextTutorialStep = prev.tutorialStep;
                if (prev.tutorialStep === 1) nextTutorialStep = 3; 

                return {
                    ...prev,
                    lifetimeEarnings: newLifetime,
                    highScore: newHighScore,
                    maxHeight: Math.max(prev.maxHeight, Math.round(currentBall.peakHeight)),
                    recordHeight: newRecordHeight,
                    tutorialStep: nextTutorialStep,
                    systemDamage: false
                };
            });

            if (currentGS.systemDamage) {
                addLog("Recovery Complete. Systems rebooting...", 'success');
                setTimeout(() => addLog("All systems operational.", 'success'), 1000);
            } else {
                addLog(`Touchdown. Initiating transfer...`, 'success');
            }

            setBall({
                ...currentBall,
                y: 0,
                vy: 0,
                isLaunched: false,
                peakHeight: 0
            });
            setDrops([]); 
            setHazards([]); 
            setPlanetEncounter(null); 
            lastDropSpawnHeightRef.current = 0;
        } else {
            setBall(prev => ({
                ...prev,
                y: newY,
                vy: newVy,
                peakHeight: newPeak
            }));
        }
    }

    // --- Rare Events Physics ---
    const activeRareEvents = rareEventsRef.current;
    if (activeRareEvents.length > 0) {
        let updatedEvents = activeRareEvents.map(ev => ({
            ...ev,
            x: ev.x + ev.vx
        })).filter(ev => ev.x > -20 && ev.x < 120); // Keep if on screen (with buffer)
        setRareEvents(updatedEvents);
    }

    // --- Airdrop Physics ---
    const activeAirdrops = airdropsRef.current;
    if (activeAirdrops.length > 0) {
        let updatedAirdrops = activeAirdrops.map(ad => {
            if (ad.isLanded) return ad;
            let nextY = ad.y + ad.vy;
            if (nextY <= 0) {
                nextY = 0;
                return { ...ad, y: 0, isLanded: true };
            }
            return { ...ad, y: nextY };
        });

        const ballX = 50; 
        const ballY = ballRef.current.y;
        const collectedIds: string[] = [];

        updatedAirdrops.forEach(ad => {
            if (ballRef.current.isLaunched && Math.abs(ad.y - ballY) < 50 && Math.abs(ad.x - ballX) < 10) {
                collectedIds.push(ad.id);
            }
        });

        if (collectedIds.length > 0) {
            collectedIds.forEach(() => {
                const rewardType = Math.random();
                if (rewardType < 0.5) {
                    const amt = 5000 * currentGS.upgrades.economy.level;
                    spawnFlyingResource(amt, 'money', window.innerWidth / 2, window.innerHeight / 2);
                    setGameState(prev => ({ 
                        ...prev, 
                        detailedStats: { ...prev.detailedStats, airdropsCollected: (prev.detailedStats?.airdropsCollected || 0) + 1 } 
                    }));
                    addLog(`Airdrop Secured: $${amt}`, 'success');
                } else {
                    const item = generateCargoItem('collectable');
                    setGameState(prev => ({ 
                        ...prev, 
                        inventory: [...prev.inventory, item],
                        detailedStats: { ...prev.detailedStats, itemsFound: (prev.detailedStats?.itemsFound || 0) + 1 }
                    }));
                    addLog(`Airdrop: Found ${item.name}`, 'success');
                    spawnParticles(window.innerWidth/2, window.innerHeight/2, 15, 'bg-orange-400');
                }
            });
            updatedAirdrops = updatedAirdrops.filter(ad => !collectedIds.includes(ad.id));
        }
        if (updatedAirdrops.length > 10) updatedAirdrops = updatedAirdrops.slice(-10);
        setAirdrops(updatedAirdrops);
    }


    // --- Birds/Hazards/Jets Logic ---
    const currentBallY = ballRef.current.y;
    // Move existing jets horizontally
    let activeHazards = hazardsRef.current.map(h => {
        if (h.type === 'jet') {
            return { ...h, x: h.x + 0.2 }; // Move jet
        }
        return h;
    }).filter(h => h.type !== 'jet' || h.x < 120); // Remove jets if off screen

    // Filter relevant hazards for drawing
    activeHazards = activeHazards.filter(h => h.y > currentBallY - 2000 || h.type === 'jet');

    const spawnChance = ballRef.current.isLaunched ? 0.005 : 0; 
    
    // Spawn standard birds/collectables
    if (Math.random() < spawnChance) { 
        activeHazards.push({
            id: Date.now().toString() + Math.random(),
            y: currentBallY + 500 + Math.random() * 500, 
            x: 10 + Math.random() * 80, 
            type: Math.random() > 0.5 ? 'collectable' : 'bird', 
            velocity: 0, 
            warningTick: 0
        });
    }
    setHazards(activeHazards);

    // Collision
    if (ballRef.current.isLaunched) {
        let hitHazardsIdx: number[] = [];
        activeHazards.forEach((h, idx) => {
            if (Math.abs(h.y - currentBallY) < 40 && Math.abs(h.x - 50) < 8) {
                hitHazardsIdx.push(idx);
            }
        });

        if (hitHazardsIdx.length > 0) {
            hitHazardsIdx.forEach(idx => {
                const hit = activeHazards[idx];
                if (hit.type === 'bird') {
                    const bonus = 500 * (currentGS.upgrades.economy.level);
                    spawnFlyingResource(bonus, 'money', window.innerWidth / 2, window.innerHeight / 2);
                    setGameState(prev => ({
                        ...prev, 
                        detailedStats: { ...prev.detailedStats, hazardsHit: (prev.detailedStats?.hazardsHit || 0) + 1 }
                    }));
                    addLog(`Target Hit! +$${bonus}`, 'success');
                    spawnParticles(window.innerWidth / 2, window.innerHeight / 2, 10, 'bg-yellow-400');
                } else if (hit.type === 'jet') {
                    const bonus = 500000 * (currentGS.upgrades.economy.level); // Huge bonus
                    spawnFlyingResource(bonus, 'money', window.innerWidth / 2, window.innerHeight / 2);
                    setGameState(prev => ({
                        ...prev,
                        detailedStats: { ...prev.detailedStats, hazardsHit: (prev.detailedStats?.hazardsHit || 0) + 1 }
                    }));
                    addLog(`JUMBO JET INTERCEPTED! +$${bonus.toLocaleString()}`, 'success');
                    spawnParticles(window.innerWidth / 2, window.innerHeight / 2, 30, 'bg-red-500');
                } else {
                    const item = generateCargoItem('collectable');
                    setGameState(prev => ({ 
                        ...prev, 
                        inventory: [...prev.inventory, item],
                        detailedStats: { ...prev.detailedStats, itemsFound: (prev.detailedStats?.itemsFound || 0) + 1 }
                    }));
                    addLog(`Collected: ${item.name}`, 'success');
                    spawnParticles(window.innerWidth / 2, window.innerHeight / 2, 15, 'bg-blue-400');
                }
            });
            setHazards(prev => prev.filter((_, i) => !hitHazardsIdx.includes(i)));
        }
    }


    // --- Drop Spawning Logic (Scaled by Altitude) ---
    if (ballRef.current.isLaunched && ballRef.current.vy > 0 && currentBallY > lastDropSpawnHeightRef.current + 500) {
        const gemBonus = currentGS.omega.gem_finder.level * currentGS.omega.gem_finder.effect;
        // Increase spawn chance slightly as we go up
        const altitudeModifier = Math.min(0.2, currentBallY / 100000); 

        if (Math.random() < (0.3 + altitudeModifier)) { 
            const rand = Math.random();
            let type: DropItem['type'] = 'money';
            
            // Base value
            let value = Math.floor(Math.random() * 9000) + 1000;
            // Add altitude scaling: +$1 per 2ft of height
            value += Math.floor(currentBallY * 0.5);

            if (rand < (0.05 + gemBonus + (altitudeModifier * 0.5)) && currentBallY > 5000) { 
                type = 'asteroid';
                value = BASE_ASTEROID_VALUE + (currentBallY * 0.1); 
            } else if (rand < (0.25 + gemBonus + (altitudeModifier * 0.5))) { 
                type = 'gem';
                // More gems higher up
                value = Math.floor(Math.random() * 9) + 1 + Math.floor(currentBallY / 20000);
            }
            
            const newDrop: DropItem = {
                id: Date.now().toString() + Math.random(),
                y: currentBallY + 400 + (Math.random() * 500), 
                x: 20 + Math.random() * 60,
                type,
                value
            };
            
            setDrops(prev => [...prev, newDrop]);
            lastDropSpawnHeightRef.current = currentBallY;
        }
    }

    // --- Drop Collection Logic ---
    if (ballRef.current.isLaunched) {
        const activeDrops = dropsRef.current;
        const collectedDrops: DropItem[] = [];
        
        activeDrops.forEach(drop => {
            if (Math.abs(drop.y - currentBallY) < 50) {
                collectedDrops.push(drop);
            }
        });

        if (collectedDrops.length > 0) {
            const remainingDrops = activeDrops.filter(d => !collectedDrops.find(c => c.id === d.id));
            setDrops(remainingDrops);

            collectedDrops.forEach(drop => {
                if (drop.type === 'money') {
                     spawnFlyingResource(drop.value, 'money', window.innerWidth / 2, window.innerHeight / 2);
                } else if (drop.type === 'gem') {
                     spawnFlyingResource(drop.value, 'gems', window.innerWidth / 2, window.innerHeight / 2);
                    spawnParticles(window.innerWidth/2, window.innerHeight/2, 10, 'bg-fuchsia-400');
                } else if (drop.type === 'asteroid') {
                    const newInventoryItem = generateCargoItem('asteroid');
                    setGameState(prev => ({ 
                        ...prev, 
                        inventory: [...prev.inventory, newInventoryItem],
                        detailedStats: { ...prev.detailedStats, itemsFound: (prev.detailedStats?.itemsFound || 0) + 1 }
                    }));
                    addLog(`Asteroid Captured! Scan required.`, 'success');
                }
            });
        }
        
        if (activeDrops.length > 20) {
            setDrops(prev => prev.filter(d => d.y > currentBallY - 1000));
        }
    }

    requestRef.current = requestAnimationFrame(updatePhysics);
  }, [addLog, spawnFlyingResource]);

  // Start Game Loop
  useEffect(() => {
    if (gameState.screen === 'GAME' && !requestRef.current) {
        requestRef.current = requestAnimationFrame(updatePhysics);
    }
    return () => {
        if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [gameState.screen, updatePhysics]);

  // --- Actions ---
  const launchBall = (e?: React.MouseEvent<HTMLButtonElement>) => {
    if (e) handleButtonClick(e, 'bg-red-500');
    if (ball.isLaunched || Object.values(modals).some(v => v)) return;

    const power = gameState.upgrades.power;
    let launchVelocity = 24 + power.level;
    
    if (megaBoostActive) {
        launchVelocity *= 5;
        setMegaBoostActive(false);
        addLog("MEGA BOOST INITIATED!", 'info');
    } else {
        addLog("Launch sequence initiated.", 'info');
    }

    setBall(prev => ({
      ...prev,
      isLaunched: true,
      vy: launchVelocity,
      y: 1,
      peakHeight: 0
    }));

    setGameState(prev => ({
      ...prev,
      totalLaunches: prev.totalLaunches + 1,
      tutorialStep: prev.tutorialStep === 1 ? 2 : 0
    }));
  };

  const handleLike = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (gameState.hasLiked) return;
      handleButtonClick(e, 'bg-red-400');
      setGameState(prev => ({
          ...prev,
          likes: (prev.likes || 0) + 1,
          hasLiked: true
      }));
  };

  const handleSendMessage = (text: string) => {
      addChatMessage(gameState.username, text);
      
      // Broadcast to other tabs
      if (chatChannelRef.current) {
          chatChannelRef.current.postMessage({ type: 'chat', sender: gameState.username, text });
      }
  };

  const redeemCode = (inputCode: string) => {
      const code = inputCode.trim();
      const lowerCode = code.toLowerCase();
      
      if (gameState.redeemedCodes.includes(lowerCode)) {
          addLog("Code already redeemed.", 'warning');
          return false;
      }

      let moneyReward = 0;
      let gemReward = 0;
      let msg = "";
      let prizeType: 'money' | 'gems' | 'item' = 'money';
      let newItem: InventoryItem | null = null;

      switch(lowerCode) {
          case 'asteroid': moneyReward = 10000; msg = "$10,000"; break;
          case 'space': moneyReward = 50000; msg = "$50,000"; break;
          case 'galaxy': moneyReward = 200000; msg = "$200,000"; break;
          case 'galactical': moneyReward = 1000000; msg = "$1,000,000"; break;
          case 'dark mater': moneyReward = 10000000; msg = "$10,000,000"; break; 
          case 'gems': gemReward = 500; msg = "500 Gems"; prizeType = 'gems'; break;
          case '???':
              moneyReward = 1000000000; // 1 Billion
              gemReward = 5000;
              newItem = {
                  id: Date.now().toString() + '_secret',
                  name: 'The Singularity',
                  rarity: '???',
                  value: 5000000000, // 5 Billion value
                  category: 'collectable',
                  date: Date.now()
              };
              msg = "DEV OVERRIDE: 1B Cash + 5k Gems + 'The Singularity'";
              prizeType = 'item';
              break;
          default: 
            addLog(`Invalid access code: ${code}`, 'danger');
            return false;
      }

      setGameState(prev => ({
          ...prev,
          money: prev.money + moneyReward,
          gems: prev.gems + gemReward,
          inventory: newItem ? [...prev.inventory, newItem] : prev.inventory,
          redeemedCodes: [...prev.redeemedCodes, lowerCode]
      }));

      // Close code modal and open prize modal
      setModals(prev => ({ ...prev, codes: false }));
      setPrizeModal({
          open: true,
          title: "ACCESS GRANTED",
          message: `Code Accepted: ${code}. Reward: ${msg}`,
          type: prizeType
      });

      addLog(`Code Accepted: ${code}`, 'success');
      spawnParticles(window.innerWidth/2, window.innerHeight/2, 20, 'bg-green-400');
      return true;
  };

  const handleRareEventClick = (event: RareEventEntity) => {
      setRareEvents(prev => prev.filter(e => e.id !== event.id));
      
      setGameState(prev => ({
          ...prev,
          detailedStats: {
              ...prev.detailedStats,
              rareEventsFound: (prev.detailedStats?.rareEventsFound || 0) + 1
          }
      }));

      if (event.type === 'golden_comet') {
          const reward = 1000000 * gameState.upgrades.economy.level; // $1M per economy level
          setPrizeModal({
              open: true,
              title: "INTERSTELLAR LOTTERY",
              message: `You intercepted a secure banking transmission! +$${reward.toLocaleString()}`,
              type: 'money'
          });
          setGameState(prev => ({ ...prev, money: prev.money + reward }));
          addLog("RARE EVENT: GOLDEN COMET INTERCEPTED", 'glitch');
      } else {
          const gems = 50;
          setPrizeModal({
              open: true,
              title: "DRONE SALVAGE",
              message: `You recovered a smuggling drone's payload. +${gems} Gems`,
              type: 'gems'
          });
          setGameState(prev => ({ ...prev, gems: prev.gems + gems }));
          addLog("RARE EVENT: DRONE DOWNED", 'success');
      }
      spawnParticles(window.innerWidth / 2, window.innerHeight / 2, 40, 'bg-yellow-400');
  };

  const collectAirdrop = (airdropId: string, e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();
      handleButtonClick(e, 'bg-orange-500');
      
      setAirdrops(prev => prev.filter(a => a.id !== airdropId));

      const rewardType = Math.random();
      if (rewardType < 0.4) { 
          const amt = 10000 * gameState.upgrades.economy.level;
          spawnFlyingResource(amt, 'money', e.clientX, e.clientY);
          setGameState(prev => ({ 
              ...prev, 
              detailedStats: { ...prev.detailedStats, airdropsCollected: (prev.detailedStats?.airdropsCollected || 0) + 1 }
          }));
          addLog(`Supply Crate: $${amt}`, 'success');
      } else if (rewardType < 0.5) { 
           spawnFlyingResource(5, 'gems', e.clientX, e.clientY);
           setGameState(prev => ({ 
               ...prev, 
               detailedStats: { ...prev.detailedStats, airdropsCollected: (prev.detailedStats?.airdropsCollected || 0) + 1 }
           }));
           addLog(`Supply Crate: 5 Gems`, 'success');
      } else {
          const item = generateCargoItem('collectable');
          setGameState(prev => ({ 
              ...prev, 
              inventory: [...prev.inventory, item],
              detailedStats: { ...prev.detailedStats, itemsFound: (prev.detailedStats?.itemsFound || 0) + 1 }
          }));
          addLog(`Supply Crate: ${item.name}`, 'success');
      }
  };

  const buyUpgrade = (type: 'power' | 'economy' | 'catapult' | 'ball') => {
    const upgrade = gameState.upgrades[type];
    if (upgrade.maxLevel && upgrade.level >= upgrade.maxLevel) return;
    const cost = Math.floor(upgrade.baseCost * Math.pow(upgrade.costMultiplier, upgrade.level - 1));

    if (gameState.money >= cost) {
      setGameState(prev => ({
        ...prev,
        money: prev.money - cost,
        upgrades: {
          ...prev.upgrades,
          [type]: { ...upgrade, level: upgrade.level + 1 }
        },
        tutorialStep: 0 
      }));
      addLog(`System Upgraded: ${upgrade.name}`, 'success');
      spawnParticles(window.innerWidth / 2, window.innerHeight / 2, 20, 'bg-green-400');
    }
  };

  const buyMaxUpgrade = (type: 'power' | 'economy' | 'catapult' | 'ball') => {
    const upgrade = gameState.upgrades[type];
    if (upgrade.maxLevel && upgrade.level >= upgrade.maxLevel) return;
    
    let currentLevel = upgrade.level;
    let currentMoney = gameState.money;
    let totalCost = 0;
    let levelsToBuy = 0;

    // Calculate max affordable levels
    while (true) {
        if (upgrade.maxLevel && currentLevel >= upgrade.maxLevel) break;
        
        const cost = Math.floor(upgrade.baseCost * Math.pow(upgrade.costMultiplier, currentLevel - 1));
        if (currentMoney >= cost) {
            currentMoney -= cost;
            totalCost += cost;
            currentLevel++;
            levelsToBuy++;
        } else {
            break;
        }
        // Safety break to prevent infinite loops in edge cases
        if (levelsToBuy > 200) break; 
    }

    if (levelsToBuy > 0) {
        setGameState(prev => ({
            ...prev,
            money: prev.money - totalCost,
            upgrades: {
                ...prev.upgrades,
                [type]: { ...upgrade, level: prev.upgrades[type].level + levelsToBuy }
            }
        }));
        addLog(`System Overclocked: +${levelsToBuy} Levels`, 'success');
        spawnParticles(window.innerWidth/2, window.innerHeight/2, 20, 'bg-yellow-400');
    }
  };

  const buyOmegaUpgrade = (type: 'gravity_dampener' | 'gem_finder') => {
      const upgrade = gameState.omega[type];
      if (upgrade.level >= upgrade.maxLevel) return;
      const moneyCost = upgrade.baseMoneyCost * Math.pow(2.5, upgrade.level);
      const gemCost = upgrade.baseGemCost * Math.pow(1.5, upgrade.level);

      if (gameState.money >= moneyCost && gameState.gems >= gemCost) {
          setGameState(prev => ({
              ...prev,
              money: prev.money - moneyCost,
              gems: prev.gems - gemCost,
              omega: {
                  ...prev.omega,
                  [type]: { ...upgrade, level: upgrade.level + 1 }
              }
          }));
          addLog(`OMEGA PROTOCOL: ${upgrade.name} Enhanced.`, 'success');
          spawnParticles(window.innerWidth / 2, window.innerHeight / 2, 40, 'bg-fuchsia-500');
      }
  };

  const buyStructure = (id: string) => {
      const k = id as keyof typeof gameState.structures;
      const struct = gameState.structures[k];
      if (struct.level >= struct.maxLevel || struct.isConstructing) return;
      
      const cost = Math.floor(struct.baseCost * Math.pow(struct.costMultiplier, struct.level));
      
      if (gameState.money >= cost) {
          setGameState(prev => ({
              ...prev,
              money: prev.money - cost,
              structures: {
                  ...prev.structures,
                  [k]: { ...prev.structures[k], isConstructing: true, constructionProgress: 0 }
              }
          }));
          // Don't close modal, let user watch construction
          addLog(`Construction Initiated: ${struct.name}`, 'info');
      }
  };

  const buyTimeShopItem = (item: TimeShopItem) => {
      if (gameState.money >= item.cost) {
          setGameState(prev => {
              let newUpgrades = { ...prev.upgrades };
              let newMoney = prev.money - item.cost;
              if (item.type === 'cash') newMoney += item.value;
              else if (item.type === 'power_level') newUpgrades.power.level += 1;
              else if (item.type === 'economy_level') newUpgrades.economy.level += 1;

              return {
                  ...prev,
                  money: newMoney,
                  upgrades: newUpgrades,
                  timeShop: {
                      ...prev.timeShop,
                      item: null 
                  }
              };
          });
          setModals(prev => ({ ...prev, timeShop: false }));
          addLog("Transaction Complete.", 'success');
      }
  };

  const buyGemShopItem = (itemId: string, cost: number) => {
      if (gameState.gems < cost) return;
      setGameState(prev => {
          let newMoney = prev.money;
          let newGems = prev.gems - cost;
          let multipliers = { ...prev.permanentMultipliers };
          if (itemId === 'cash_small') newMoney += 10000;
          if (itemId === 'cash_large') newMoney += 1000000;
          if (itemId === 'multiplier') multipliers.money *= 2;
          if (itemId === 'boost') setMegaBoostActive(true);
          return {
              ...prev,
              gems: newGems,
              money: newMoney,
              permanentMultipliers: multipliers
          };
      });
      setModals(prev => ({ ...prev, gemShop: false }));
      addLog("Premium Purchase Confirmed.", 'success');
  };

  const spinWheel = (cost: number) => {
      if (gameState.gems < cost) return;
      const rand = Math.random();
      let title = "";
      let message = "";
      let rewardType: 'money' | 'gems' | 'power' | 'economy' | 'item' = 'money';
      let value = 0;
      let newItem: InventoryItem | null = null;
      const currentGS = gameStateRef.current;
      
      if (rand < 0.25) { 
         value = 5000000 * currentGS.upgrades.economy.level; 
         title = "HYPER CASH INJECTION";
         message = `$${value.toLocaleString()}`;
         rewardType = 'money';
      } else if (rand < 0.50) { 
         value = 300;
         title = "GEM CACHE";
         message = `300 Gems`;
         rewardType = 'gems';
      } else if (rand < 0.70) { 
         value = 3;
         title = "CATAPULT OVERCHARGE";
         message = "+3 Power Levels";
         rewardType = 'power';
      } else if (rand < 0.90) { 
         value = 3;
         title = "MARKET SYNERGY";
         message = "+3 Money Levels";
         rewardType = 'economy';
      } else { 
         newItem = {
             id: Date.now().toString(),
             name: 'Dark Matter Core',
             rarity: 'Legendary',
             value: 100000000, 
             category: 'collectable',
             date: Date.now()
         };
         title = "ANOMALY CONTAINED";
         message = `Item: Dark Matter Core`;
         rewardType = 'item';
      }

      setGameState(prev => {
          let newMoney = prev.money;
          let newGems = prev.gems - cost;
          let newUpgrades = { ...prev.upgrades };
          let newInventory = [...prev.inventory];
          let newStats = { ...prev.detailedStats };

          if (rewardType === 'money') newMoney += value;
          if (rewardType === 'gems') {
              newGems += value;
              newStats.totalGemsEarned += value;
          }
          if (rewardType === 'power') newUpgrades.power.level += value;
          if (rewardType === 'economy') newUpgrades.economy.level += value;
          if (newItem) {
              newInventory.push(newItem);
              newStats.itemsFound += 1;
          }

          return {
              ...prev,
              money: newMoney,
              gems: newGems,
              upgrades: newUpgrades,
              inventory: newInventory,
              detailedStats: newStats
          };
      });

      setPrizeModal({ open: true, title, message, type: rewardType });
  };

  const handleCrateSpin = (): { type: 'money' | 'gems' | 'item', val: number, item?: InventoryItem, name: string } | null => {
    if (gameState.money < 1000000 || gameState.gems < 1000) return null;

    // Deduct
    setGameState(prev => ({ ...prev, money: prev.money - 1000000, gems: prev.gems - 1000 }));

    // Roll Logic
    const rand = Math.random();
    
    if (rand < 0.15) {
        // Jackpot Money
        const amount = 50000000; // 50M
        setGameState(prev => ({ ...prev, money: prev.money + amount }));
        return { type: 'money', val: amount, name: '$50,000,000' };
    } else if (rand < 0.3) {
        // Jackpot Gems
        const amount = 5000;
        setGameState(prev => ({ ...prev, gems: prev.gems + amount, detailedStats: {...prev.detailedStats, totalGemsEarned: (prev.detailedStats?.totalGemsEarned || 0) + amount} }));
        return { type: 'gems', val: amount, name: '5,000 Gems' };
    } else {
        // High Tier Item (60% Legendary, 40% Epic of available items)
        const isLegendary = Math.random() > 0.4; 
        const template = CARGO_ITEMS.filter(i => i.rarity === (isLegendary ? 'Legendary' : 'Epic') || i.rarity === '???');
        // Fallback if filter fails (shouldn't with current constants)
        const safeTemplate = template.length > 0 ? template : CARGO_ITEMS;
        const itemT = safeTemplate[Math.floor(Math.random() * safeTemplate.length)];
        
        const newItem: InventoryItem = {
             id: Date.now().toString(),
             name: itemT.name,
             rarity: itemT.rarity,
             value: itemT.baseValue * 2, // Premium Version
             category: 'collectable',
             date: Date.now()
        };

        setGameState(prev => ({ 
            ...prev, 
            inventory: [...prev.inventory, newItem],
            detailedStats: { ...prev.detailedStats, itemsFound: (prev.detailedStats?.itemsFound || 0) + 1 }
        }));
        
        return { type: 'item', val: newItem.value, item: newItem, name: newItem.name };
    }
  };

  const buyWorld = (world: WorldTheme, cost: number) => {
      if (gameState.money >= cost) {
          setGameState(prev => ({
              ...prev,
              money: prev.money - cost,
              unlockedWorlds: [...prev.unlockedWorlds, world],
              currentWorld: world
          }));
          addLog(`Destination Authorized: ${world}`, 'success');
          spawnParticles(window.innerWidth / 2, window.innerHeight / 2, 30, 'bg-emerald-400');
      }
  };

  const hireManager = () => {
      if (gameState.money >= MANAGER_HIRE_COST) {
          setGameState(prev => ({
              ...prev,
              money: prev.money - MANAGER_HIRE_COST,
              manager: { ...prev.manager, hired: true, lastGemClaim: Date.now() }
          }));
          addLog("Director Kael Hired.", 'success');
      }
  };

  const upgradeManager = () => {
      const cost = Math.floor(MANAGER_UPGRADE_COST_BASE * Math.pow(MANAGER_UPGRADE_COST_MULT, gameState.manager.level - 1));
      if (gameState.money >= cost) {
          setGameState(prev => ({
              ...prev,
              money: prev.money - cost,
              manager: { ...prev.manager, level: prev.manager.level + 1 }
          }));
          addLog("Gem Logistics Upgraded.", 'success');
      }
  };

  const sellInventoryItem = (itemId: string, name: string) => {
      setGameState(prev => {
          const item = prev.inventory.find(i => i.id === itemId);
          if (!item) return prev;
          spawnFlyingResource(item.value, 'money', window.innerWidth / 2, window.innerHeight / 2);
          return {
              ...prev,
              inventory: prev.inventory.filter(i => i.id !== itemId)
          };
      });
      addLog(`Sold data for "${name}".`, 'success');
  };

  const handleSellAll = () => {
      if (gameState.inventory.length === 0) return;
      
      const totalValue = gameState.inventory.reduce((acc, item) => acc + item.value, 0);
      spawnFlyingResource(totalValue, 'money', window.innerWidth / 2, window.innerHeight / 2);

      setGameState(prev => ({
          ...prev,
          inventory: []
      }));
      addLog(`Bulk sale complete: $${totalValue.toLocaleString()}`, 'success');
      toggleModal('inventory');
  };

  const handleMilestoneContinue = () => {
     setGameState(prev => ({
         ...prev,
         money: prev.money + milestoneModal.reward
     }));
     setMilestoneModal({ ...milestoneModal, open: false });
  };

  const toggleModal = (modal: keyof typeof modals, e?: React.MouseEvent<HTMLButtonElement | HTMLDivElement>, color?: string) => {
      if (e && e.currentTarget instanceof HTMLButtonElement) handleButtonClick(e as React.MouseEvent<HTMLButtonElement>, color);
      if (gameState.systemDamage && modal !== 'shop') return;

      setModals(prev => ({
          shop: modal === 'shop' ? !prev.shop : false,
          timeShop: modal === 'timeShop' ? !prev.timeShop : false,
          map: modal === 'map' ? !prev.map : false,
          worlds: modal === 'worlds' ? !prev.worlds : false,
          gemShop: modal === 'gemShop' ? !prev.gemShop : false,
          inventory: modal === 'inventory' ? !prev.inventory : false,
          controlTower: modal === 'controlTower' ? !prev.controlTower : false,
          spinWheel: modal === 'spinWheel' ? !prev.spinWheel : false,
          cosmicEvent: modal === 'cosmicEvent' ? !prev.cosmicEvent : false,
          manager: modal === 'manager' ? !prev.manager : false,
          stats: modal === 'stats' ? !prev.stats : false,
          chat: modal === 'chat' ? !prev.chat : false,
          build: modal === 'build' ? !prev.build : false,
          codes: modal === 'codes' ? !prev.codes : false,
          crate: modal === 'crate' ? !prev.crate : false,
      }));
      if (modal === 'shop' && gameState.tutorialStep === 3) {
          setGameState(prev => ({ ...prev, tutorialStep: 0 }));
      }
  };

  const canAffordAnyUpgrade = () => {
      const p = gameState.upgrades.power;
      const pCost = Math.floor(p.baseCost * Math.pow(p.costMultiplier, p.level - 1));
      const e = gameState.upgrades.economy;
      const eCost = Math.floor(e.baseCost * Math.pow(e.costMultiplier, e.level - 1));
      return gameState.money >= pCost || gameState.money >= eCost;
  };

  // --- Render Helpers ---
  const renderBallGraphic = () => {
      const level = gameState.upgrades.ball.level;
      if (level === 1) return <div className="w-full h-full rounded-full bg-white shadow-[inset_-2px_-2px_5px_rgba(0,0,0,0.2)]" />;
      if (level === 2) return <div className="w-full h-full rounded-full bg-gradient-to-br from-red-400 to-red-600 border-2 border-red-800" />;
      if (level === 3) return <div className="w-full h-full rounded-full bg-gradient-to-br from-cyan-300 to-blue-500 shadow-[0_0_10px_#22d3ee]" />;
      if (level >= 4) return (
        <div className="w-full h-full rounded-full bg-black relative overflow-hidden border border-fuchsia-500 shadow-[0_0_15px_#d946ef]">
            <div className="absolute inset-0 bg-fuchsia-900/50 animate-pulse" />
        </div>
      );
      return null;
  };

  const renderCatapultGraphic = () => {
      const level = gameState.upgrades.catapult.level;
      let baseColor = "bg-amber-800";
      let accentColor = "bg-amber-700";
      let detail = null;
      if (level === 2) { baseColor = "bg-slate-600"; accentColor = "bg-slate-500"; }
      if (level === 3) { baseColor = "bg-blue-900"; accentColor = "bg-blue-700"; }
      if (level >= 4) { baseColor = "bg-gray-900"; accentColor = "bg-fuchsia-900"; detail = <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-20 w-2 h-2 bg-fuchsia-400 rounded-full animate-ping" />; }

      return (
          <>
            <div className={`w-2 h-16 ${baseColor} rounded-t-md transform -rotate-12 origin-bottom mx-1 transition-colors duration-500`} />
            <div className={`w-2 h-16 ${baseColor} rounded-t-md transform rotate-12 origin-bottom mx-1 transition-colors duration-500`} />
            <div className={`absolute top-8 w-12 h-2 ${accentColor} rounded-full transition-colors duration-500`} />
            {detail}
          </>
      );
  };

  if (gameState.screen === 'TITLE') {
      return <TitleScreen onStart={startTutorial} />;
  }

  const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
  const cameraOffset = Math.max(0, ball.y - (viewportHeight * 0.4));

  const getGroundColor = () => {
      switch(gameState.currentWorld) {
          case 'Mars': return 'bg-red-800 border-red-600';
          case 'Neon': return 'bg-fuchsia-900 border-fuchsia-500';
          case 'Void': return 'bg-gray-900 border-gray-700';
          default: return 'bg-emerald-900 border-emerald-500';
      }
  };

  return (
    <div className="relative w-full h-full bg-black overflow-hidden text-white select-none">
      
      {particles.map(p => (
          <div key={p.id} className={`absolute w-2 h-2 rounded-full animate-ping pointer-events-none z-50 ${p.color}`} style={{ left: p.x, top: p.y }} />
      ))}

      {/* FLYING RESOURCES */}
      {flyingResources.map(res => (
          <div 
             key={res.id} 
             className="absolute z-[70] pointer-events-none font-bold text-lg drop-shadow-md animate-pulse flex items-center gap-1"
             style={{ 
                 left: res.currentX, 
                 top: res.currentY,
                 color: res.type === 'money' ? '#4ade80' : '#e879f9' // green-400 : fuchsia-400
             }}
          >
              {res.type === 'money' ? '+' : '+'}
              {res.type === 'money' ? <img src={CARTOON_MONEY_IMG} className="w-6 h-6 object-contain drop-shadow-md" alt="$" /> : <Diamond className="w-5 h-5 fill-fuchsia-400" />}
              {res.value.toLocaleString()}
          </div>
      ))}

      <Background altitude={ball.y} theme={gameState.currentWorld} />

      <ControlTower logs={gameState.logs} onClick={() => toggleModal('controlTower')} />

      {isAutoSaving && (
          <div className="absolute top-4 right-4 z-30 flex items-center gap-2 text-xs text-slate-400 font-mono animate-pulse">
              <Save className="w-3 h-3" /> SAVING...
          </div>
      )}

      {/* RARE EVENTS OVERLAY (Fixed on screen) */}
      <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
        {rareEvents.map(event => (
            <button
                key={event.id}
                onClick={() => handleRareEventClick(event)}
                className="absolute pointer-events-auto transition-transform hover:scale-110 active:scale-95 group"
                style={{ top: event.y, left: `${event.x}%` }}
            >
                {event.type === 'golden_comet' ? (
                    <div className="flex items-center gap-2">
                        <div className="w-16 h-8 bg-yellow-400 rounded-full blur-[2px] animate-pulse flex items-center justify-center shadow-[0_0_20px_#facc15]">
                            <div className="w-full h-1 bg-white opacity-80" />
                        </div>
                        <div className="w-32 h-1 bg-gradient-to-l from-yellow-400 to-transparent opacity-50 absolute right-full top-1/2 -translate-y-1/2" />
                    </div>
                ) : (
                    <div className="w-10 h-10 bg-slate-800 rounded border-2 border-red-500 animate-spin flex items-center justify-center shadow-[0_0_15px_#ef4444]">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
                    </div>
                )}
            </button>
        ))}
      </div>

      <div className="absolute inset-0 w-full h-full" style={{ transform: `translateY(${cameraOffset}px)`, transition: gameState.systemDamage ? 'transform 0.1s linear, margin 0.1s ease' : 'transform 0.1s linear', marginLeft: gameState.systemDamage ? `${Math.random() * 10 - 5}px` : '0px' }}>
        
        {planetEncounter && (
            <div className="absolute left-1/2 -translate-x-1/2 w-[800px] h-[800px] flex items-center justify-center animate-in fade-in zoom-in duration-300" style={{ bottom: planetEncounter.y }}>
                {gameState.systemDamage ? (
                     <div className="relative w-full h-full">
                        <div className="absolute inset-0 bg-orange-600 rounded-full animate-ping opacity-20" />
                        <div className="absolute top-0 left-0 w-1/2 h-full bg-orange-800 rounded-l-full transform -translate-x-8 -rotate-6 transition-transform duration-1000 overflow-hidden border-r-4 border-black/50"><div className="absolute inset-0 bg-black/20" /></div>
                        <div className="absolute top-0 right-0 w-1/2 h-full bg-orange-700 rounded-r-full transform translate-x-8 rotate-6 transition-transform duration-1000 overflow-hidden border-l-4 border-black/50"><div className="absolute inset-0 bg-black/10" /></div>
                        <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-orange-900 rounded-full -translate-x-20 -translate-y-20 blur-sm animate-pulse" />
                     </div>
                ) : (
                    <div className="w-full h-full bg-orange-600 rounded-full shadow-[0_0_100px_rgba(234,88,12,0.8)] relative overflow-hidden">
                         <div className="absolute inset-4 border-4 border-orange-400/30 rounded-full" />
                         <div className="w-full h-20 bg-orange-800/20 absolute top-[30%] rotate-12 blur-xl" />
                    </div>
                )}
            </div>
        )}

        {airdrops.map(ad => (
             <div key={ad.id} onClick={(e) => collectAirdrop(ad.id, e)} className={`absolute flex flex-col items-center cursor-pointer transition-transform hover:scale-110 z-20 ${ad.isLanded ? 'animate-bounce' : ''}`} style={{ bottom: ad.y, left: `${ad.x}%` }}>
                {!ad.isLanded && ( <ArrowDown className="w-12 h-12 text-white drop-shadow-lg animate-pulse" /> )}
                <div className="w-10 h-10 bg-orange-600 border-2 border-orange-400 rounded shadow-lg flex items-center justify-center"><Box className="w-6 h-6 text-orange-200" /></div>
             </div>
        ))}

        {hazards.map(hazard => (
            <div key={hazard.id} className="absolute w-12 h-12 flex items-center justify-center" style={{ bottom: hazard.y, left: `${hazard.x}%` }}>
                {hazard.type === 'bird' ? ( 
                    <Bird className="w-8 h-8 text-yellow-400 animate-pulse drop-shadow-[0_0_5px_rgba(250,204,21,0.8)]" /> 
                ) : hazard.type === 'jet' ? (
                    <Plane className="w-16 h-16 text-slate-100 fill-slate-500 drop-shadow-lg rotate-45" />
                ) : (
                    <div className="relative"><div className="absolute inset-0 bg-blue-500 blur-md opacity-50 animate-pulse" /><Star className="w-8 h-8 text-cyan-300 fill-cyan-100 drop-shadow-[0_0_5px_rgba(34,211,238,0.8)]" /></div>
                )}
            </div>
        ))}

        {drops.map(drop => (
            <div key={drop.id} className={`absolute flex items-center justify-center animate-bounce ${drop.type === 'asteroid' ? 'w-16 h-16' : 'w-10 h-10'}`} style={{ bottom: drop.y, left: `${drop.x}%` }}>
                {drop.type === 'money' && ( <img src={CARTOON_MONEY_IMG} className="w-10 h-10 object-contain drop-shadow-lg animate-wobble" alt="$" /> )}
                {drop.type === 'gem' && ( <div className="bg-fuchsia-500 p-2 rounded-full shadow-[0_0_10px_#d946ef] animate-ping"><Diamond className="w-6 h-6 text-white" /></div> )}
                {drop.type === 'asteroid' && (
                    <div className="w-16 h-16 bg-stone-600 rounded-full shadow-[inset_-5px_-5px_10px_rgba(0,0,0,0.5)] border-2 border-stone-500 flex items-center justify-center animate-spin-slow">
                        <div className="w-3 h-3 bg-stone-800 rounded-full absolute top-3 left-3 opacity-50" /><div className="w-4 h-4 bg-stone-800 rounded-full absolute bottom-4 right-4 opacity-50" />
                    </div>
                )}
            </div>
        ))}

        <div className={`absolute left-0 right-0 h-[400px] bg-gradient-to-b border-t-4 transition-colors duration-500 ${getGroundColor()}`} style={{ bottom: `-${300}px` }}>
            {gameState.currentWorld === 'Earth' && <div className="w-full h-4 bg-emerald-500/30 absolute top-0" />}
            
            {/* Base Structures Render Layer */}
            <div className="absolute -top-[100px] left-0 right-0 h-32 pointer-events-none flex items-end justify-around px-8 opacity-90">
                {/* Mission Control */}
                {gameState.structures.mission_control.level > 0 && !gameState.structures.mission_control.isConstructing && (
                    <div className="flex flex-col items-center">
                        <div className="w-24 h-20 bg-slate-800 border-2 border-blue-500 rounded-t-xl relative flex items-center justify-center">
                            <div className="w-16 h-8 bg-blue-900/50 rounded-t-lg mb-2" />
                            <div className="absolute -top-4 w-2 h-4 bg-slate-400" />
                            <div className="absolute -top-8 w-12 h-6 rounded-full border-b-2 border-slate-400 bg-slate-700 -rotate-12" />
                        </div>
                        <div className="bg-black/50 px-2 rounded text-[10px] text-blue-300 font-mono mt-1">Control Lvl {gameState.structures.mission_control.level}</div>
                    </div>
                )}
                
                {/* Placeholder for center (Catapult is drawn separately) */}
                <div className="w-24" /> 

                {/* Launch Gantry */}
                {gameState.structures.launch_gantry.level > 0 && !gameState.structures.launch_gantry.isConstructing && (
                    <div className="absolute left-[55%] bottom-0 flex flex-col items-center">
                        <div className="w-16 h-48 bg-gradient-to-t from-slate-800 to-slate-700 border-x-4 border-slate-600 flex flex-col items-center justify-around">
                             <div className="w-full h-1 bg-slate-900/50" />
                             <div className="w-full h-1 bg-slate-900/50" />
                             <div className="w-full h-1 bg-slate-900/50" />
                        </div>
                        <div className="bg-black/50 px-2 rounded text-[10px] text-red-300 font-mono mt-1 z-10">Gantry Lvl {gameState.structures.launch_gantry.level}</div>
                    </div>
                )}

                {/* Xeno Lab */}
                {gameState.structures.xeno_lab.level > 0 && !gameState.structures.xeno_lab.isConstructing && (
                     <div className="flex flex-col items-center">
                        <div className="w-24 h-24 bg-slate-900 rounded-full border-4 border-green-500 relative overflow-hidden shadow-[0_0_20px_rgba(34,197,94,0.3)]">
                            <div className="absolute inset-0 bg-green-500/20 animate-pulse" />
                            <div className="absolute bottom-0 w-full h-10 bg-slate-800" />
                        </div>
                        <div className="bg-black/50 px-2 rounded text-[10px] text-green-300 font-mono mt-1">Lab Lvl {gameState.structures.xeno_lab.level}</div>
                     </div>
                )}
            </div>
        </div>

        <div className="absolute left-1/2 -translate-x-1/2 w-16 h-20 flex items-end justify-center" style={{ bottom: '0px' }}>
            {renderCatapultGraphic()}
            <div className={`absolute bottom-10 w-1 h-24 bg-amber-600 origin-bottom transition-transform duration-300 ${ball.isLaunched ? '-rotate-45' : 'rotate-0'}`} style={{ backgroundColor: gameState.upgrades.catapult.level >= 3 ? '#1e3a8a' : (gameState.upgrades.catapult.level >= 2 ? '#475569' : '#d97706') }}>
                <div className={`absolute top-0 -left-3 w-8 h-6 rounded-b-full border-2 ${gameState.upgrades.catapult.level >= 3 ? 'bg-blue-950 border-blue-700' : 'bg-amber-900 border-amber-700'}`} />
            </div>
        </div>

        {/* BALL RENDER - CLAMPED TO PREVENT GROUND GLITCHING */}
        <div 
            className="absolute left-1/2 -translate-x-1/2 rounded-full shadow-lg z-10 flex items-center justify-center" 
            style={{ 
                width: `${BALL_SIZE}px`, 
                height: `${BALL_SIZE}px`, 
                bottom: `${Math.max(0, ball.y) + 40}px`, // Visual clamp logic
                transform: `rotate(${ball.y * 2}deg)` 
            }}
        >
            {renderBallGraphic()}
        </div>
        
        {/* MILESTONE LINES */}
        {[500, 2000, 10000, 50000, 100000, 500000, GOAL_HEIGHT].map(height => (
           <div key={height} className="absolute left-0 right-0 border-t border-dashed border-white/20 text-white/30 text-xs pl-4 flex items-center" style={{ bottom: `${height}px` }}>{height.toLocaleString()} ft {height === GOAL_HEIGHT && "- EDGE OF UNIVERSE"}</div>
        ))}
      </div>

      <div className="absolute top-0 left-0 right-0 p-4 flex flex-col gap-2 z-20 pointer-events-none">
        <div className="flex justify-end items-start pointer-events-auto">
            <div className="flex flex-col items-end gap-2">
                <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700 rounded-full px-4 py-2 flex items-center gap-3 shadow-lg w-fit transition-transform hover:scale-105">
                    <div className="w-8 h-8 flex items-center justify-center"><img src={CARTOON_MONEY_IMG} className="w-full h-full object-contain" alt="$" /></div>
                    <span className="text-xl font-mono font-bold text-green-400">{gameState.money.toLocaleString()}</span>
                </div>
                <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700 rounded-full px-4 py-2 flex items-center gap-3 shadow-lg w-fit transition-transform hover:scale-105">
                    <div className="bg-fuchsia-500 p-1 rounded-full"><Diamond className="w-4 h-4 text-white" /></div>
                    <span className="text-xl font-mono font-bold text-fuchsia-400">{gameState.gems.toLocaleString()}</span>
                </div>
                <div className="bg-slate-900/80 backdrop-blur-md border border-fuchsia-500/50 rounded-full px-4 py-1 flex items-center gap-2 shadow-[0_0_10px_rgba(192,38,211,0.2)] mb-1 cursor-help group" title="Time until next massive upgrade event">
                    <Infinity className="w-3 h-3 text-fuchsia-400 animate-pulse" />
                    <span className="text-xs font-mono font-bold text-fuchsia-200 tracking-wider group-hover:text-white transition-colors">EVENT: {cosmicTimeLeft}</span>
                </div>
                
                <div className="flex gap-2 mt-1">
                     <button onClick={(e) => toggleModal('spinWheel', e, 'bg-fuchsia-500')} disabled={gameState.systemDamage} className={`bg-slate-900/80 border border-slate-600 rounded-full p-3 shadow-lg transition-all active:scale-95 hover:bg-fuchsia-900`}><CircleDot className="w-6 h-6 text-fuchsia-400 hover:text-white" /></button>
                     <button onClick={(e) => toggleModal('crate', e, 'bg-purple-600')} disabled={gameState.systemDamage} className={`bg-slate-900/80 border border-slate-600 rounded-full p-3 shadow-lg transition-all active:scale-95 hover:bg-purple-900`}><Gift className="w-6 h-6 text-purple-400 hover:text-white" /></button>
                     <button onClick={(e) => toggleModal('gemShop', e, 'bg-fuchsia-400')} disabled={gameState.systemDamage} className={`bg-slate-900/80 border border-slate-600 rounded-full p-3 shadow-lg transition-all active:scale-95 ${gameState.systemDamage ? 'opacity-50 grayscale cursor-not-allowed' : 'hover:bg-fuchsia-900'}`}>{gameState.systemDamage ? <AlertTriangle className="w-6 h-6 text-red-500" /> : <Diamond className="w-6 h-6 text-fuchsia-400 hover:text-white" />}</button>
                     <button onClick={(e) => toggleModal('timeShop', e, 'bg-cyan-400')} disabled={gameState.systemDamage} className={`bg-slate-900/80 border border-slate-600 rounded-full p-3 shadow-lg transition-all active:scale-95 ${gameState.systemDamage ? 'opacity-50 grayscale cursor-not-allowed' : 'hover:bg-cyan-900'}`}><Clock className="w-6 h-6 text-cyan-400 hover:text-white" /></button>
                    <button onClick={(e) => toggleModal('shop', e, 'bg-indigo-400')} disabled={gameState.systemDamage} className={`relative bg-slate-900/80 border border-slate-600 rounded-full p-3 shadow-lg transition-all active:scale-95 ${gameState.systemDamage ? 'opacity-50 grayscale cursor-not-allowed' : 'hover:bg-indigo-600'}`}><ShoppingCart className="w-6 h-6 text-white" />{!gameState.systemDamage && canAffordAnyUpgrade() && <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white font-bold text-xs flex items-center justify-center rounded-full animate-bounce border border-white">!</div>}</button>
                </div>
            </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-8 z-30 flex gap-4 pointer-events-auto">
         <button onClick={(e) => toggleModal('build', e, 'bg-amber-500')} disabled={gameState.systemDamage} className={`flex flex-col items-center justify-center w-14 h-14 rounded-2xl bg-slate-800/80 border border-amber-600 backdrop-blur active:scale-95 transition-all ${gameState.systemDamage ? 'opacity-50 grayscale cursor-not-allowed' : 'hover:bg-slate-700'}`}><Hammer className="w-5 h-5 text-amber-500 mb-1" /><span className="text-[9px] uppercase font-bold tracking-wider">Build</span></button>
         <button onClick={(e) => toggleModal('map', e, 'bg-blue-400')} disabled={gameState.systemDamage} className={`flex flex-col items-center justify-center w-14 h-14 rounded-2xl bg-slate-800/80 border border-slate-600 backdrop-blur active:scale-95 transition-all ${gameState.systemDamage ? 'opacity-50 grayscale cursor-not-allowed' : 'hover:bg-slate-700'}`}><MapIcon className="w-5 h-5 text-blue-400 mb-1" /><span className="text-[9px] uppercase font-bold tracking-wider">Map</span></button>
         <button onClick={(e) => toggleModal('worlds', e, 'bg-emerald-500')} disabled={gameState.systemDamage} className={`flex flex-col items-center justify-center w-14 h-14 rounded-2xl bg-slate-800/80 border border-slate-600 backdrop-blur active:scale-95 transition-all ${gameState.systemDamage ? 'opacity-50 grayscale cursor-not-allowed' : 'hover:bg-slate-700'}`}><Globe className="w-5 h-5 text-emerald-400 mb-1" /><span className="text-[9px] uppercase font-bold tracking-wider">Worlds</span></button>
         <button onClick={(e) => toggleModal('inventory', e, 'bg-orange-400')} disabled={gameState.systemDamage} className={`flex flex-col items-center justify-center w-14 h-14 rounded-2xl bg-slate-800/80 border border-slate-600 backdrop-blur active:scale-95 transition-all relative ${gameState.systemDamage ? 'opacity-50 grayscale cursor-not-allowed' : 'hover:bg-slate-700'}`}><Package className="w-5 h-5 text-orange-400 mb-1" /><span className="text-[9px] uppercase font-bold tracking-wider">Cargo</span>{gameState.inventory.length > 0 && <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full text-[9px] flex items-center justify-center border border-slate-900">{gameState.inventory.length}</div>}</button>
         <button onClick={(e) => toggleModal('codes', e, 'bg-green-600')} disabled={gameState.systemDamage} className={`flex flex-col items-center justify-center w-14 h-14 rounded-2xl bg-slate-800/80 border border-slate-600 backdrop-blur active:scale-95 transition-all relative ${gameState.systemDamage ? 'opacity-50 grayscale cursor-not-allowed' : 'hover:bg-slate-700'}`}><Terminal className="w-5 h-5 text-green-400 mb-1" /><span className="text-[9px] uppercase font-bold tracking-wider">Codes</span></button>
         <button onClick={(e) => toggleModal('stats', e, 'bg-cyan-600')} disabled={gameState.systemDamage} className={`flex flex-col items-center justify-center w-14 h-14 rounded-2xl bg-slate-800/80 border border-slate-600 backdrop-blur active:scale-95 transition-all relative ${gameState.systemDamage ? 'opacity-50 grayscale cursor-not-allowed' : 'hover:bg-slate-700'}`}><BarChart3 className="w-5 h-5 text-cyan-400 mb-1" /><span className="text-[9px] uppercase font-bold tracking-wider">Data</span></button>
      </div>

      <div className="absolute bottom-8 right-8 z-30 pointer-events-auto flex items-end gap-4">
        {/* Like Button */}
        <button 
            onClick={handleLike}
            disabled={gameState.hasLiked}
            className={`flex flex-col items-center justify-center w-16 h-16 rounded-full bg-slate-800 border-2 shadow-lg transition-all group
                ${gameState.hasLiked ? 'border-red-500 cursor-default' : 'border-red-500/50 hover:bg-slate-700 active:scale-95'}
            `}
        >
            <Heart className={`w-6 h-6 transition-all ${gameState.hasLiked ? 'text-red-500 fill-red-500' : 'text-red-500 fill-red-500/20 group-hover:fill-red-500'}`} />
            <span className="text-xs font-bold text-red-400 mt-1">{gameState.likes || 0}</span>
        </button>

        <button onClick={launchBall} disabled={ball.isLaunched || gameState.systemDamage} className={`relative w-24 h-24 rounded-full border-4 border-white/20 flex items-center justify-center shadow-2xl transition-all duration-200 ${ball.isLaunched || gameState.systemDamage ? 'bg-slate-700 cursor-not-allowed opacity-50 grayscale' : 'bg-red-600 hover:bg-red-500 active:scale-95 active:bg-red-700 hover:shadow-red-500/50 shadow-red-900/50'} ${megaBoostActive ? 'animate-pulse ring-4 ring-red-400' : ''}`}><span className="font-black text-white text-sm tracking-wider uppercase pointer-events-none select-none">{ball.isLaunched ? '...' : gameState.systemDamage ? 'ERR' : megaBoostActive ? 'MEGA' : 'Launch'}</span>{!ball.isLaunched && !gameState.systemDamage && <span className="absolute inset-0 rounded-full animate-ping bg-red-500 opacity-20" />}</button>
      </div>

      <TutorialOverlay step={gameState.tutorialStep} />
      <Shop isOpen={modals.shop} onClose={() => toggleModal('shop')} money={gameState.money} gems={gameState.gems} upgrades={gameState.upgrades} omega={gameState.omega} onBuyUpgrade={buyUpgrade} onBuyMaxUpgrade={buyMaxUpgrade} onBuyOmega={buyOmegaUpgrade} />
      <CosmicEventModal isOpen={modals.cosmicEvent} onClose={handleClaimCosmicEvent} />
      <SpinWheelModal isOpen={modals.spinWheel} onClose={() => toggleModal('spinWheel')} gems={gameState.gems} onSpin={spinWheel} />
      <PrizeModal isOpen={prizeModal.open} onClose={() => setPrizeModal(prev => ({ ...prev, open: false }))} title={prizeModal.title} message={prizeModal.message} type={prizeModal.type} />
      <TimeShopModal isOpen={modals.timeShop} onClose={() => toggleModal('timeShop')} item={gameState.timeShop.item} nextRefresh={gameState.timeShop.nextRefresh} money={gameState.money} onBuy={buyTimeShopItem} />
      <GemShop isOpen={modals.gemShop} onClose={() => toggleModal('gemShop')} gems={gameState.gems} onBuy={buyGemShopItem} />
      <InventoryModal isOpen={modals.inventory} onClose={() => toggleModal('inventory')} inventory={gameState.inventory} onSellItem={sellInventoryItem} onSellAll={handleSellAll} />
      <MapModal isOpen={modals.map} onClose={() => toggleModal('map')} currentHeight={Math.round(ball.y)} recordHeight={gameState.recordHeight} />
      <WorldsModal isOpen={modals.worlds} onClose={() => toggleModal('worlds')} currentWorld={gameState.currentWorld} unlockedWorlds={gameState.unlockedWorlds} onSelectWorld={(w) => setGameState(prev => ({ ...prev, currentWorld: w }))} onBuyWorld={buyWorld} money={gameState.money} />
      <ControlTowerModal isOpen={modals.controlTower} onClose={() => toggleModal('controlTower')} />
      <ManagerModal isOpen={modals.manager} onClose={() => toggleModal('manager')} money={gameState.money} manager={gameState.manager} onHire={hireManager} onUpgrade={upgradeManager} onChat={() => {}} />
      <StatsModal isOpen={modals.stats} onClose={() => toggleModal('stats')} gameState={gameState} />
      <ChatModal isOpen={modals.chat} onClose={() => toggleModal('chat')} messages={gameState.chatHistory} onSendMessage={handleSendMessage} username={gameState.username} />
      <BuildModal isOpen={modals.build} onClose={() => toggleModal('build')} money={gameState.money} structures={gameState.structures} onBuild={buyStructure} />
      <CodesModal isOpen={modals.codes} onClose={() => toggleModal('codes')} onRedeem={redeemCode} />
      <CrateModal isOpen={modals.crate} onClose={() => toggleModal('crate')} money={gameState.money} gems={gameState.gems} onSpin={handleCrateSpin} />
      <MilestoneModal isOpen={milestoneModal.open} onClose={handleMilestoneContinue} height={milestoneModal.height} reward={milestoneModal.reward} message={milestoneModal.message} />
    </div>
  );
};

export default App;
