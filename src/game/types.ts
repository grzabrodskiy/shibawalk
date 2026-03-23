export type Direction = -1 | 0 | 1;
export type EventType = 'cat' | 'rain' | 'dog' | 'stubborn';
export type DestinationKey =
  | 'home'
  | 'park'
  | 'cafe'
  | 'postOffice'
  | 'restaurant'
  | 'petStore';

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
  levels: LevelDefinition[];
  worldProps: WorldProp[];
  mood: IntentProfile;
  moodTimeLeft: number;
  activeEvent: ActiveEvent | null;
  nextEventIn: number;
  screamTimeLeft: number;
  won: boolean;
}

export interface LevelDefinition {
  id: `level-${number}`;
  index: number;
  title: string;
  startLabel: string;
  destinationLabel: string;
  startKey: DestinationKey;
  destinationKey: DestinationKey;
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
    | 'postOffice'
    | 'restaurant'
    | 'petStore';
  lane?: 'front' | 'back';
}

export interface MoodSummary {
  title: string;
  body: string;
}
