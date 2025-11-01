import { Isabel } from './domain-models/PCs/Isabel';
import { Couatl } from './domain-models/NPCs/Couatl';
import { IsabelForTests } from './domain-models/NPCs/IsabelForTests';
import { Duel } from './Duel';
import { DuelLauncher } from './DuelLauncher';
import { LogKeeper } from './LogKeeper';

describe('DEV', () => {
  describe('Duels', () => {
    it('Isabel vs Isabel_2 without unawares', () => {
      const logKeeper = new LogKeeper(true);
      const testedChar = new Isabel(logKeeper);
      const testedEnemy = new IsabelForTests(logKeeper);

      new Duel(logKeeper, { testedChar, testedEnemy }).run();

      expect(testedChar.battleCharacteristics.HP <= 0 || testedEnemy.battleCharacteristics.HP <= 0).toBeTruthy();
    }, 30);

    it('Isabel vs Isabel_2 with unawares', () => {
      const logKeeper = new LogKeeper(true);
      const testedChar = new Isabel(logKeeper);
      const testedEnemy = new IsabelForTests(logKeeper);

      new Duel(logKeeper, { testedChar, testedEnemy, withUnawares: true }).run();

      expect(testedChar.battleCharacteristics.HP <= 0 || testedEnemy.battleCharacteristics.HP <= 0).toBeTruthy();
    }, 30);
  });

  describe('DuelLauncher', () => {
    it('Isabel vs IsabelForTests', () => {
      new DuelLauncher({
        chars: { tested: Isabel, enemy: IsabelForTests },
        retries: { withUnawares: 3, withoutUnawares: 3 },
        logSettings: {},
      }).run();
    }, 30);

    it('Isabel vs Couatl', () => {
      new DuelLauncher({
        chars: { tested: Isabel, enemy: Couatl },
        retries: { withUnawares: 3, withoutUnawares: 3 },
        logSettings: {},
      }).run();
    }, 30);
  });
});
