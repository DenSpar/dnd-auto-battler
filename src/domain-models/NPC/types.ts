import { NpcDescription } from 'src/domain-models/NPC/NpcDescription';
import { TCharacterProps } from '../BaseCharacter/types';

export enum ENpcChallenge {
  FOUR = 4,
  FIVE = 5,
}

export type TNpcProps = TCharacterProps<NpcDescription>;
