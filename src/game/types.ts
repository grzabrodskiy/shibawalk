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

export interface WorldProp {
  id: string;
  x: number;
  kind: 'tree' | 'lamp' | 'bench' | 'flower' | 'home' | 'park' | 'treat';
  lane?: 'front' | 'back';
}

export interface MoodSummary {
  title: string;
  body: string;
}
