import { LogKeeper } from '../../LogKeeper';
import { roll, roll20 } from '../../roll';
import {
  EMainCharacteristics,
  TAttack,
  TMainCharacteristics,
  TTacticAction,
  TAnyCharacter,
} from '../BaseCharacter/types';
import { ENpcChallenge, TNpcProps } from '../NPC/types';
import { NPC } from '../NPC';
import { NpcDescription } from '../NPC/NpcDescription';

const characteristics: TMainCharacteristics = { STR: 16, DEX: 20, CON: 17, INT: 17, WIS: 20, CHA: 18 };
const attackList = ['bite', 'compression'];

/** предполагается только истинный облик */
export class Couatl extends NPC {
  constructor(logKeeper: LogKeeper, overrideCharProps?: Partial<TNpcProps>) {
    super(
      logKeeper,
      {
        name: 'Couatl',
        characteristics,
        battleCharacteristics: { AC: 19, HP: 97 },

        modifiers: { CON: 5, WIS: 7, CHA: 6 },
        proficiency: 2,
        resources: { spell_cureWounds: 3 },
        passiveSkills: { trueSight: true },

        description: new NpcDescription({
          description:
            'Коатль — доброжелательное змееподобное существо большого интеллекта и проницательности. Их ярко раскрашенные крылья и вежливые манеры говорят о небесном происхождении.',
          challenge: ENpcChallenge.FOUR,
          dndSuLink: 'https://dnd.su/bestiary/57-couatl/',
          rusName: 'Коатль',
        }),

        // TODO: переделать изменение свойств на статичный метод. Скорее всего в Character
        ...overrideCharProps,
      },
      attackList
    );

    this.attackMap = {
      bite: this.bite(),
      compression: this.compression(),
    };
    this.actionMap = {
      spell_cureWounds: this.spell_cureWounds,
    };
  }

  tactic(): TTacticAction {
    // не понадобилось
    // if (!this.getResource('spell_cureWounds')) {
    //   this.spell_cureWounds();
    // }

    const nextAttackKey = attackList.find((attackKey) => this.isAttackCanBeNext(attackKey));
    if (nextAttackKey) {
      this.incrementUsedAttack(nextAttackKey);
      return { type: 'attack', key: nextAttackKey };
    } else {
      return { type: 'attack', key: 'uknown' };
    }
  }

  private bite(): TAttack {
    return {
      attackRoll: ({ enemy }) => {
        const advantage = this.isAdvantage(enemy);
        if (advantage) {
          this.addLog('attack with advantage');
        }
        const mainRoll = roll20({ advantage });

        return {
          result: mainRoll.result + 8,
          isCritSuccess: mainRoll.isCritSuccess,
        };
      },
      damageRoll: ({ isCritSuccess: isAttackRollHasCritSuccess, enemy }) => {
        let result = 0;
        const isCritSuccess = isAttackRollHasCritSuccess;
        if (isCritSuccess) {
          this.addLog('damage with CRIT success');
        }

        const biteDam = roll(isCritSuccess ? 'D6' : '2D6') + 5;
        result += biteDam;

        const isEnemyPoisoned = enemy.savingThrow(EMainCharacteristics.CON, 13);

        if (isEnemyPoisoned) {
          enemy.setUnconscious();
          this.addLog(`отравил ${enemy.name}. Пока цель отравлена, она лишена сознания`);
          result += enemy.battleCharacteristics.HP - result;
        }

        return result;
      },
    };
  }

  private compression(): TAttack {
    return {
      attackRoll: ({ enemy }) => {
        const advantage = this.isAdvantage(enemy);
        if (advantage) {
          this.addLog('attack with advantage');
        }
        const mainRoll = roll20({ advantage });

        return {
          result: mainRoll.result + 5,
          isCritSuccess: mainRoll.isCritSuccess,
        };
      },
      damageRoll: ({ isCritSuccess: isAttackRollHasCritSuccess, enemy }) => {
        let result = 0;
        const isCritSuccess = isAttackRollHasCritSuccess;
        if (isCritSuccess) {
          this.addLog('damage with CRIT success');
        }

        const compressionDam = roll(isCritSuccess ? '2D6' : '4D6') + 5;
        result += compressionDam;

        enemy.setGrappled();

        return result;
      },
    };
  }

  private spell_cureWounds(): void {
    const cureHP = roll('1D8') + this.getModifier(EMainCharacteristics.CHA);
    this.battleCharacteristics.HP = this.battleCharacteristics.HP + cureHP;
  }

  private isAdvantage(enemy: TAnyCharacter): boolean {
    return enemy.isGrappled();
  }
}
