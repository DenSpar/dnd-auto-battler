import { PcDescription } from 'src/domain-models/PC/PcDescription';
import { BaseCharacter } from '.';
import { Duel } from '../../Duel';

import { TDuelContext } from '../../types/common.types';
import { NpcDescription } from 'src/domain-models/NPC/NpcDescription';

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

export type TAnyCharacter = BaseCharacter<TIntersectionDescription>;

export type TTurnData = { context: TDuelContext; enemy: BaseCharacter<TIntersectionDescription> };

export type TAttack = {
  attackRoll(props: TTurnData): {
    result: number;
    isCritSuccess: boolean;
  };
  damageRoll(props: TTurnData & { isCritSuccess: boolean }): number;
};

export type TActionProps = TTurnData & { setContext: Duel['setContext'] };
export type TAction = (props: TActionProps) => void;
export type TTacticType = 'attack' | 'action';
export type TTacticAction = { type: TTacticType; key: string };

export type TCharacterProps<TDescription = TIntersectionDescription> = {
  name: string;
  characteristics: TMainCharacteristics;
  battleCharacteristics: TBattleCharacteristics;

  proficiency: number;
  description: TDescription;

  modifiers?: TModifiers;
  resources?: Record<string, number>;
  passiveSkills?: Partial<Record<TPassiveSkillKeys, true>>;
};

export type TIntersectionDescription = PcDescription | NpcDescription;

export type TPassiveSkillKeys = 'trueSight' | 'blindSight';

export enum EMainCharacteristics {
  STR = 'STR',
  DEX = 'DEX',
  CON = 'CON',
  INT = 'INT',
  WIS = 'WIS',
  CHA = 'CHA',
}
