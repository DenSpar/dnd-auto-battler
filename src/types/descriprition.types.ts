import { ENpcChallenge } from './npc.types';

export interface INpcDescription extends ICommonDescription {
  challenge: ENpcChallenge;
  dndSuLink: string;
}

interface ICommonDescription {
  description: string;
  rusName: string;
}
