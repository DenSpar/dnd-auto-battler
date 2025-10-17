import { Character } from '../domain-models/Character';
import { Duel } from '../Duel';

import { TDuelContext } from './common.types';

export type TMainCharacteristics = {
  STR: number;
  DEX: number;
  CON: number;
  INT: number;
  WIS: number;
  CHA: number;
};

export type TBattleCharacteristics = {
  AC: number;
  HP: number;
};

export type TModifiers = {
  inititive?: number;
} & Partial<TMainCharacteristics>;

export type TTurnData = { context: TDuelContext; enemy: Character };

export type TAttack = {
  attackRoll(props: TTurnData): {
    result: number;
    isCritSuccess: boolean;
  };
  damageRoll(props: TTurnData & { isCritSuccess: boolean }): number;
};

export type TActionProps = TTurnData & { setContext: Duel['setContext'] };
export type TAction = (props: TActionProps) => any;
export type TTacticType = 'attack' | 'action';
export type TTacticAction = { type: TTacticType; key: string };

export type TCharProps = {
  name: string;
  characteristics: TMainCharacteristics;
  battleCharacteristics: TBattleCharacteristics;

  modifiers?: TModifiers;
  proficiency?: number;
  resources?: Record<string, number>;
  passiveSkills?: Partial<Record<TPassiveSkillKeys, true>>;
};

export type TPassiveSkillKeys = 'trueSight' | 'blindSight';

export enum EMainCharacteristics {
  STR = 'STR',
  DEX = 'DEX',
  CON = 'CON',
  INT = 'INT',
  WIS = 'WIS',
  CHA = 'CHA',
}
