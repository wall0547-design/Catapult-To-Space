

import { UpgradeStats, WorldTheme, Rarity, OmegaUpgrade, Structure } from "./types";

export const GRAVITY = 0.6;
export const GROUND_FRICTION = 0.8;
export const GROUND_LEVEL_OFFSET = 100;

export const GOAL_HEIGHT = 1000000; // The Edge of the Universe
export const TIME_SHOP_INTERVAL = 2 * 60 * 1000; // 2 minutes
export const MASSIVE_UPGRADE_INTERVAL = 10 * 60 * 1000; // 10 minutes
export const MANAGER_GEM_INTERVAL = 10000; // 10 seconds
export const MANAGER_HIRE_COST = 1000000;
export const MANAGER_UPGRADE_COST_BASE = 500000;
export const MANAGER_UPGRADE_COST_MULT = 1.8;

// Heights that trigger the "Congrats" modal
export const MILESTONES = [
    { height: 5000, rewardMoney: 10000, message: "Leaving the Troposphere" },
    { height: 25000, rewardMoney: 50000, message: "Stratosphere Reached" },
    { height: 50000, rewardMoney: 100000, message: "Mesosphere Entry" },
    { height: 100000, rewardMoney: 500000, message: "Thermosphere - Space Begins" },
    { height: 250000, rewardMoney: 2000000, message: "Low Earth Orbit" },
    { height: 500000, rewardMoney: 10000000, message: "High Orbit" },
    { height: 800000, rewardMoney: 50000000, message: "Lunar Distance" },
    { height: 1000000, rewardMoney: 500000000, message: "THE EDGE OF THE UNIVERSE" },
];

// Asteroids are rare but valuable
export const BASE_ASTEROID_VALUE = 50000; 

export const CARGO_ITEMS: { name: string; baseValue: number; rarity: Rarity }[] = [
  { name: 'Space Rock', baseValue: 5000, rarity: 'Common' },
  { name: 'Iron Ore', baseValue: 8000, rarity: 'Common' },
  { name: 'Satellite Part', baseValue: 15000, rarity: 'Common' },
  { name: 'Moon Dust', baseValue: 25000, rarity: 'Rare' },
  { name: 'Golden Meteorite', baseValue: 50000, rarity: 'Rare' },
  { name: 'Void Geode', baseValue: 100000, rarity: 'Epic' },
  { name: 'UFO Fragment', baseValue: 250000, rarity: 'Epic' },
  { name: 'Alien Circuit', baseValue: 500000, rarity: 'Legendary' },
  { name: 'Dark Matter Vial', baseValue: 1000000, rarity: 'Legendary' },
  { name: 'Time Crystal', baseValue: 5000000, rarity: '???' },
];

export const WORLD_COSTS: Record<WorldTheme, number> = {
  Earth: 0,
  Mars: 500000,
  Neon: 2000000,
  Void: 10000000
};

export const WORLD_MULTIPLIERS: Record<WorldTheme, number> = {
    Earth: 1,
    Mars: 3,
    Neon: 8,
    Void: 20
};

// Standard Upgrades
export const INITIAL_POWER_UPGRADE: UpgradeStats = {
  id: 'power',
  name: 'Catapult Height',
  description: 'Increases launch power by +1.',
  level: 1,
  baseCost: 10, // Cheaper start
  costMultiplier: 1.15, // Much lower cost scaling (was 1.4)
  effectMultiplier: 1, // Exactly +1 per level
};

export const INITIAL_ECONOMY_UPGRADE: UpgradeStats = {
  id: 'economy',
  name: 'Money per Launch',
  description: 'Increases base money earned per landing.',
  level: 1,
  baseCost: 5, 
  costMultiplier: 1.6,
  effectMultiplier: 1, 
};

// Rebalanced Visual Upgrades (Expensive but Powerful)
export const INITIAL_CATAPULT_UPGRADE: UpgradeStats = {
    id: 'catapult',
    name: 'Launcher Tech',
    description: 'Upgrades the catapult structure. Multiplies ALL earnings massively.',
    level: 1,
    baseCost: 100000, 
    costMultiplier: 4.0, 
    effectMultiplier: 0.5, 
    maxLevel: 5
};

export const INITIAL_BALL_UPGRADE: UpgradeStats = {
    id: 'ball',
    name: 'Projectile Aero',
    description: 'Advanced aerodynamics reduces drag significantly.',
    level: 1,
    baseCost: 75000, 
    costMultiplier: 3.5, 
    effectMultiplier: 0.15, 
    maxLevel: 5
};

// Omega Upgrades
export const INITIAL_OMEGA_GRAVITY: OmegaUpgrade = {
    id: 'gravity_dampener',
    name: 'Gravity Dampener',
    description: 'Reduces global gravity by 5% per level.',
    level: 0,
    maxLevel: 5,
    baseMoneyCost: 100000,
    baseGemCost: 10,
    effect: 0.05
};

export const INITIAL_OMEGA_GEM: OmegaUpgrade = {
    id: 'gem_finder',
    name: 'Gem Scanner',
    description: 'Increases the chance to find gems in space.',
    level: 0,
    maxLevel: 5,
    baseMoneyCost: 500000,
    baseGemCost: 25,
    effect: 0.02 
};

// Structures (Big Money Sinks)
export const INITIAL_STRUCTURES: {
    mission_control: Structure;
    launch_gantry: Structure;
    xeno_lab: Structure;
} = {
    mission_control: {
        id: 'mission_control',
        name: 'Mission Control',
        description: 'Generates passive income every second based on your Record Height.',
        level: 0,
        maxLevel: 10,
        baseCost: 1000000, // 1M
        costMultiplier: 2.5,
        effectDescription: '+$10/sec per 1000ft Record',
    },
    launch_gantry: {
        id: 'launch_gantry',
        name: 'Launch Gantry',
        description: 'Heavy duty scaffolding that massively boosts landing rewards.',
        level: 0,
        maxLevel: 5,
        baseCost: 5000000, // 5M
        costMultiplier: 3.0,
        effectDescription: '+50% Earnings Multiplier',
    },
    xeno_lab: {
        id: 'xeno_lab',
        name: 'Xeno-Laboratory',
        description: 'Research facility that increases the value of all found artifacts.',
        level: 0,
        maxLevel: 5,
        baseCost: 10000000, // 10M
        costMultiplier: 4.0,
        effectDescription: '2x Asteroid/Cargo Value',
    }
};

export const BALL_SIZE = 24;