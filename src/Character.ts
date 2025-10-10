import { LogKeeper } from './LogKeeper';
import { roll20 } from './roll';
import {
  EMainCharacteristics,
  TAction,
  TAttack,
  TBattleCharacteristics,
  TCharProps,
  TMainCharacteristics,
  TModifiers,
  TTacticAction,
  TTurnData,
} from './types/character.types';

export abstract class Character implements TCharProps {
  logKeeper: LogKeeper;

  name: string;
  characteristics: TMainCharacteristics;
  battleCharacteristics: TBattleCharacteristics;

  modifiers: TModifiers;
  proficiency: number;
  resources: Record<string, number>;

  abstract attackMap: Record<string, TAttack>;
  abstract actionMap: Record<string, TAction>;
  abstract tactic(props: TTurnData): TTacticAction;

  constructor(logKeeper: LogKeeper, props: TCharProps) {
    this.logKeeper = logKeeper;

    this.name = props.name;
    this.characteristics = props.characteristics;
    this.battleCharacteristics = props.battleCharacteristics;

    this.modifiers = props.modifiers || {};
    this.proficiency = props.proficiency || 0;
    this.resources = props.resources || {};
  }

  rollIninitiative() {
    const initiativeBonus = this.modifiers.inititive || this.getModifier(EMainCharacteristics.DEX);
    return roll20().result + initiativeBonus;
  }

  getModifier(char: EMainCharacteristics): number {
    const characteristic = this.characteristics[char];
    if (characteristic === 10) {
      return 0;
    } else if (characteristic > 10) {
      return Math.floor((this.characteristics[char] - 10) / 2);
    } else {
      return Math.floor((this.characteristics[char] - 20) / 2);
    }
  }

  getAttack(attackKey: string): TAttack {
    const attack = this.attackMap[attackKey];
    if (!attack) {
      throw new Error(`Attack key '${attackKey}' not found`);
    }
    return attack;
  }

  savingThrow(char: EMainCharacteristics, difficult: number): boolean {
    const thr = roll20();
    const modifier = this.modifiers[char] || this.getModifier(char);

    return thr.result + modifier >= difficult;
  }

  takeDamage(damage: number) {
    this.battleCharacteristics.HP -= damage;
    this.addLog(`get ${damage} damage, rest ${this.battleCharacteristics.HP} HP`);
    return this.isAlive();
  }

  getResource(resKey: string) {
    const resource = this.resources[resKey];
    if (resource === undefined) {
      throw new Error(`Неизвестный ресурс - ${resKey}`);
    }

    if (resource < 0) {
      throw new Error(`Что-то пошло не так - ресурс ${resKey} меньше нуля`);
    }

    if (resource === 0) {
      return 0;
    }

    this.resources[resKey]--;
    return resource + 1;
  }

  getAction(actionKey: string): TAction {
    const action = this.actionMap[actionKey];
    if (!action) {
      throw new Error(`Action key '${actionKey}' not found`);
    }
    return action;
  }

  addLog(message: string) {
    this.logKeeper.addLog(this.name, message);
  }

  private isAlive(): boolean {
    return this.battleCharacteristics.HP > 0;
  }
}
