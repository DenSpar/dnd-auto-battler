import { Character } from '../Character';
import { roll, roll20 } from '../roll';
import { EMainCharacteristics, TActionProps, TMainCharacteristics } from '../types/character.types';

const characteristics: TMainCharacteristics = { STR: 8, DEX: 18, CON: 10, INT: 13, WIS: 12, CHA: 16 };

export const Isabel = new Character({
  name: 'Isabel',
  characteristics,
  battleCharacteristics: { AC: 16, HP: 54 },
  attackMap: {
    kerambit: {
      attackRoll: ({ context, thisChar }) => {
        // TODO: 68.5 перенести этот лог в Duel
        console.log(thisChar.name, `use ATTACK 'kerambit'`);

        if (!thisChar) throw new Error('attackRoll | thisChar is undefined');

        const mainRoll = roll20({ advantage: context.darkness });

        return {
          result: thisChar.proficiency + thisChar.getModifier(EMainCharacteristics.DEX) + mainRoll.result,
          isCritSuccess: mainRoll.isCritSuccess,
        };
      },
      damageRoll: ({ context, isCritSuccess, thisChar, enemy }) => {
        let result = 0;

        const dexMod = thisChar.getModifier(EMainCharacteristics.DEX);
        result += dexMod;

        const daggerDam = roll(isCritSuccess ? 'D4' : '2D4');
        result += daggerDam;

        const isSneak = context.darkness;
        if (isSneak) {
          const sneakDam = roll(isCritSuccess ? '2D6' : '4D6');
          result += sneakDam;
        }

        if (thisChar.getResource('bardicInspirationCount')) {
          const whispDam = roll(isCritSuccess ? '3D6' : '6D6');
          result += whispDam;
        }

        if (thisChar.getResource('poison')) {
          const fullPoisonDam = roll('3D6');
          const poisonDam = enemy.savingThrow(EMainCharacteristics.CON, 11)
            ? Math.floor(fullPoisonDam / 2)
            : fullPoisonDam;
          result += poisonDam;
        }

        return result;
      },
    },
  },
  actionMap: {
    darkness: ({ thisChar, setContext }: TActionProps) => {
      // TODO: 68.6 своевременность вызова этого метода

      // TODO: 68.5 перенести этот лог в Duel
      console.log(thisChar.name, `use ACTION 'darkness'`);

      setContext({ darkness: true });
    },
  },
  tactic: ({ context }) => {
    if (!context.darkness) {
      return { type: 'action', key: 'darkness' };
    }
    return { type: 'attack', key: 'kerambit' };
  },
  proficiency: 4,
  resources: {
    bardicInspirationCount: Math.floor((characteristics.CHA - 10) / 2),
    poison: 1,
  },
});
