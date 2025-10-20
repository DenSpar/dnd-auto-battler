import { LogKeeper } from '../../LogKeeper';
import { TPcProps } from '../PC/types';
import { Isabel } from '../PCs/Isabel';

export class IsabelForTests extends Isabel {
  constructor(logKeeper: LogKeeper, overrideCharProps?: Partial<TPcProps>) {
    super(logKeeper, { name: 'Isabel_enemy', ...overrideCharProps });
  }
}
