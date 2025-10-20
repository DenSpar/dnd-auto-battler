import { ENpcChallenge } from '../domain-models/NPC/types';

export interface INpcDescription extends ICommonDescription {
  challenge: ENpcChallenge;
  dndSuLink: string;
}

export interface ICharacterDescription extends ICommonDescription {
  characterLevel: number;
  levelExplanation: TLevelExplanation[];
  levelUpHistory: TLevelUpHistory[];
}

export type TLevelExplanation = {
  class: ECharacterClass;
  archetype: string;
  level: number;
};

export type TLevelUpHistory = {
  level: number;
  class: ECharacterClass;
};

export enum ECharacterClass {
  BARD = 'Bard',
  ROGUE = 'Rogue',
}

interface ICommonDescription {
  description: string;
  rusName: string;
}
