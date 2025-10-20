import { LogKeeper } from '../../LogKeeper';
import { BaseCharacter } from '../BaseCharacter';

import { PcDescription } from './PcDescription';
import { TPcProps } from './types';

export abstract class PC extends BaseCharacter<PcDescription> {
  constructor(logKeeper: LogKeeper, props: TPcProps) {
    super(logKeeper, props);
  }
}
