import { Isabel } from '../characters/Isabel';
import { LogKeeper } from '../LogKeeper';
import { TCharProps } from '../types/character.types';

export class IsabelForTests extends Isabel {
  constructor(logKeeper: LogKeeper, overrideCharProps?: Partial<TCharProps>) {
    super(logKeeper, { name: 'Isabel_enemy', ...overrideCharProps });
  }
}
