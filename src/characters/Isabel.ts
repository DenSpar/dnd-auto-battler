import { Character } from '../Character';
import { LogKeeper } from '../LogKeeper';
import { roll, roll20 } from '../roll';
import {
  EMainCharacteristics,
  TAction,
  TActionProps,
  TAttack,
  TCharProps,
  TMainCharacteristics,
  TTacticAction,
  TTurnData,
} from '../types/character.types';
import { TDuelContext } from '../types/common.types';

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
      ...overrideCharProps,
    });

    this.attackMap = {
      kerambit: this.kerambit(),
    };
    this.actionMap = {
      spell_darkness: this.spell_darkness,
    };
  }

  tactic({ context }: TTurnData): TTacticAction {
    if (!this.isAdvantage(context)) {
      return { type: 'action', key: 'spell_darkness' };
    }
    return { type: 'attack', key: 'kerambit' };
  }

  private kerambit(): TAttack {
    return {
      attackRoll: ({ context }) => {
        const advantage = this.isAdvantage(context);
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

        const isSneak = this.isAdvantage(context);
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

  private isAdvantage(context: TDuelContext): boolean {
    return context.darkness || this.isLiquidation(context);
  }
}
