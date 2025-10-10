import { Character } from './Character';
import { Isabel } from './characters/Isabel';
import { Duel } from './Duel';

const Isabel_2 = new Character({
  ...Isabel,
  name: 'Isabel_2',
  battleCharacteristics: { ...Isabel.battleCharacteristics },
  // modifiers: { ...Isabel.modifiers, inititive: -20 },
});

describe('Duels', () => {
  it('Isabel vs Isabel_2', () => {
    new Duel(Isabel, Isabel_2).run();
  });
});
