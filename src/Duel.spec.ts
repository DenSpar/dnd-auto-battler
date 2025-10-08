import { Isabel } from './characters/Isabel';
import { Duel } from './Duel';
import { DuelLauncher } from './DuelLauncher';
import { IsabelForTests } from './enemies/IsabelForTests';
import { LogKeeper } from './LogKeeper';

describe('DEV', () => {
  describe.skip('Duels', () => {
    it('Isabel vs Isabel_2 without unawares', () => {
      const logKeeper = new LogKeeper(true);
      const testedChar = new Isabel(logKeeper);
      const testedEnemy = new IsabelForTests(logKeeper);

      new Duel(logKeeper, { testedChar, testedEnemy }).run();

      expect(testedChar.battleCharacteristics.HP <= 0 || testedEnemy.battleCharacteristics.HP <= 0).toBeTruthy();
    });

    it('Isabel vs Isabel_2 with unawares', () => {
      const logKeeper = new LogKeeper(true);
      const testedChar = new Isabel(logKeeper);
      const testedEnemy = new IsabelForTests(logKeeper);

      new Duel(logKeeper, { testedChar, testedEnemy, withUnawares: true }).run();

      expect(testedChar.battleCharacteristics.HP <= 0 || testedEnemy.battleCharacteristics.HP <= 0).toBeTruthy();
    });
  });

  describe('DuelLauncher', () => {
    it('launch 3 times duel', () => {
      new DuelLauncher({
        chars: { tested: Isabel, enemy: IsabelForTests },
        retries: { withUnawares: 3, withoutUnawares: 3 },
      }).run();
    });
  });
});
