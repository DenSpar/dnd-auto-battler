import { LogKeeper } from '../../LogKeeper';
import { TAction, TAttack } from '../BaseCharacter/types';

import { BaseCharacter } from '../BaseCharacter';
import { NpcDescription } from './NpcDescription';
import { TNpcProps } from './types';

export abstract class NPC extends BaseCharacter<NpcDescription> implements TNpcProps {
  attackMap: Record<string, TAttack>;
  actionMap: Record<string, TAction>;
  usedAttacks: Record<string, number>;

  constructor(logKeeper: LogKeeper, props: TNpcProps, attackList: string[]) {
    super(logKeeper, props);
    this.usedAttacks = attackList.reduce((acc, cur) => ({ ...acc, [cur]: 0 }), {});
  }

  incrementUsedAttack(attackName: string): void {
    this.validateAttack(attackName);
    this.usedAttacks[attackName] = this.usedAttacks[attackName] + 1;
  }

  isAttackCanBeNext(attackName: string): boolean {
    this.validateAttack(attackName);

    const thisAttackCount = this.usedAttacks[attackName];
    if (!thisAttackCount) {
      return true;
    }

    return Object.entries(this.usedAttacks).every((attack) => attack[0] === attackName || attack[1] >= thisAttackCount);
  }

  private validateAttack(attackName: string): void {
    if (!Number.isInteger(this.usedAttacks[attackName])) {
      throw new Error(`Uknown attack ${attackName}`);
    }
  }
}
