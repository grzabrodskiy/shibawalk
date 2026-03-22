export type Direction = -1 | 0 | 1;
export type EventType = 'cat' | 'rain' | 'dog' | 'stubborn';

export interface IntentProfile {
  label: string;
  description: string;
  direction: Direction;
  speed: number;
}

export interface ActiveEvent {
  type: EventType;
  label: string;
  description: string;
  timeLeft: number;
  direction: Direction;
  speed: number;
  screenX: number;
  switchIn: number;
}

export interface GameState {
  elapsed: number;
  progress: number;
  furthestProgress: number;
  velocity: number;
  facing: Direction;
  pullReserve: number;
  treats: number;
  treatBoost: number;
  treatVisualTimeLeft: number;
  collectedTreats: string[];
  mood: IntentProfile;
  moodTimeLeft: number;
  activeEvent: ActiveEvent | null;
  nextEventIn: number;
  screamTimeLeft: number;
  won: boolean;
}

export interface LevelDefinition {
  id: 'level-1' | 'level-2' | 'level-3';
  index: number;
  title: string;
  startLabel: string;
  destinationLabel: string;
  startProgress: number;
  endProgress: number;
}

export interface RouteStatus {
  level: LevelDefinition;
  progressPct: number;
  distanceToGoal: string;
}

export interface WorldProp {
  id: string;
  x: number;
  kind:
    | 'tree'
    | 'lamp'
    | 'bench'
    | 'flower'
    | 'home'
    | 'park'
    | 'treat'
    | 'fountain'
    | 'cafe'
    | 'postOffice';
  lane?: 'front' | 'back';
}

export interface MoodSummary {
  title: string;
  body: string;
}
