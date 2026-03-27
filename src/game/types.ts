export type Direction = -1 | 0 | 1;
export type EventType = 'cat' | 'rain' | 'dog' | 'bigDog' | 'stubborn';
export type CatCoat = 'classic' | 'orangeTabby' | 'white';
export type DogCoat =
  | 'sand'
  | 'charcoal'
  | 'cream'
  | 'shepherd'
  | 'blackTan'
  | 'mahogany';
export type OwnerOutfit = 'slate' | 'forest' | 'mustard' | 'berry';
export type OwnerHaircut = 'bob' | 'wavy' | 'pixie' | 'ponytail';
export type OwnerHeadwear = 'none' | 'beanie' | 'baseballCap' | 'beret' | 'topHat';
export type CarriedItem = 'flowers' | 'coffee' | 'parcel' | 'takeout' | 'petBag';
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
  catCoat?: CatCoat;
  dogCoat?: DogCoat;
  ownerOutfit?: OwnerOutfit;
  ownerHaircut?: OwnerHaircut;
  ownerHeadwear?: OwnerHeadwear;
  shibaCallout?: string;
  animalCallout?: string;
  personCallout?: string;
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
  walkerStridePhase: number;
  shibaStridePhase: number;
  animalStridePhase: number;
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
  lastCompletedLevelIndex: number;
  levelCompleteTimeLeft: number;
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
