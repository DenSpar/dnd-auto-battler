import { INpcDescription } from 'src/types/descriprition.types';
import { ENpcChallenge } from 'src/types/npc.types';

export class NpcDescription implements INpcDescription {
  readonly challenge: ENpcChallenge;
  readonly dndSuLink: string;
  readonly description: string;

  constructor(props: INpcDescription) {
    this.challenge = props.challenge;
    this.dndSuLink = props.dndSuLink;
    this.description = props.description;
  }
}
