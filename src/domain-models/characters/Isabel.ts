import { LogKeeper } from '../../LogKeeper';
import { roll, roll20 } from '../../roll';
import {
  EMainCharacteristics,
  TAction,
  TActionProps,
  TAttack,
  TCharProps,
  TMainCharacteristics,
  TTacticAction,
  TTurnData,
} from '../../types/character.types';
import { TDuelContext } from '../../types/common.types';
import { Character } from '../Character';

const characteristics: TMainCharacteristics = { STR: 8, DEX: 18, CON: 10, INT: 13, WIS: 12, CHA: 16 };

export class Isabel extends Character {
  attackMap: Record<string, TAttack>;
  actionMap: Record<string, TAction>;

  constructor(logKeeper: LogKeeper, overrideCharProps?: Partial<TCharProps>) {
    super(logKeeper, {
      name: 'Isabel',
      characteristics,
      battleCharacteristics: { AC: 16, HP: 54 },

      proficiency: 4,
      resources: {
        bardicInspirationCount: Math.floor((characteristics.CHA - 10) / 2),
        poison: 1,
      },
      passiveSkills: { blindSight: true },
      ...overrideCharProps,
    });

    this.attackMap = {
      kerambit: this.kerambit(),
    };
    this.actionMap = {
      spell_darkness: this.spell_darkness,
    };
  }

  tactic({ context, enemy }: TTurnData): TTacticAction {
    if (!this.isAdvantage(context, enemy) && enemy.canBeBlinded()) {
      return { type: 'action', key: 'spell_darkness' };
    }
    return { type: 'attack', key: 'kerambit' };
  }

  private kerambit(): TAttack {
    return {
      attackRoll: ({ context, enemy }) => {
        const advantage = this.isAdvantage(context, enemy);
        if (advantage) {
          this.addLog('attack with advantage');
        }
        const mainRoll = roll20({ advantage });

        return {
          result: this.proficiency + this.getModifier(EMainCharacteristics.DEX) + mainRoll.result,
          isCritSuccess: mainRoll.isCritSuccess,
        };
      },
      damageRoll: ({ context, isCritSuccess: isAttackRollHasCritSuccess, enemy }) => {
        let result = 0;
        const isCritSuccess = isAttackRollHasCritSuccess || this.isUnawares(context);
        if (isCritSuccess) {
          this.addLog('damage with CRIT success');
        }

        const dexMod = this.getModifier(EMainCharacteristics.DEX);
        result += dexMod;

        const daggerDam = roll(isCritSuccess ? 'D4' : '2D4');
        result += daggerDam;

        const isSneak = this.isAdvantage(context, enemy);
        if (isSneak) {
          const sneakDam = roll(isCritSuccess ? '2D6' : '4D6');
          result += sneakDam;
        }

        if (this.getResource('bardicInspirationCount')) {
          const whispDam = roll(isCritSuccess ? '3D6' : '6D6');
          result += whispDam;
        }

        if (this.getResource('poison')) {
          const fullPoisonDam = roll('3D6');
          const poisonDam = enemy.savingThrow(EMainCharacteristics.CON, 11)
            ? Math.floor(fullPoisonDam / 2)
            : fullPoisonDam;
          result += poisonDam;
        }

        return result;
      },
    };
  }

  // TODO: 68.4 переделать Ликвидацию
  /**
   * Вы совершаете с преимуществом броски атаки по всем существам, которые еще не совершали ход в этом бою.
   * Кроме того, все попадания по существам, захваченным в расплох, являются критическими попаданиями
   */
  private isLiquidation(context: TDuelContext): boolean {
    const result = context.turnNumber <= 1;

    if (result) this.addLog('used Liquidation');

    return result;
  }

  private isUnawares(context: TDuelContext): boolean {
    const result = context.turnNumber === 0;

    if (result) this.addLog('used Unawares');

    return result;
  }

  private spell_darkness({ setContext }: TActionProps): ReturnType<TAction> {
    setContext({ darkness: true });
  }

  private isAdvantage(context: TDuelContext, enemy: Character): boolean {
    return (context.darkness && enemy.isBlinded(context)) || this.isLiquidation(context);
  }
}
