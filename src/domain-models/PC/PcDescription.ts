import { ICharacterDescription, TLevelExplanation, TLevelUpHistory } from 'src/types/descriprition.types';

export class PcDescription implements ICharacterDescription {
  readonly description: string;
  readonly characterLevel: number;
  readonly levelExplanation: TLevelExplanation[];
  readonly levelUpHistory: TLevelUpHistory[];
  readonly rusName: string;

  constructor(props: ICharacterDescription) {
    this.characterLevel = props.characterLevel;
    this.levelExplanation = props.levelExplanation;
    this.levelUpHistory = props.levelUpHistory;
    this.description = props.description;
    this.rusName = props.rusName;
  }
}
