import { Isabel } from '../domain-models/characters/Isabel';
import { Couatl } from '../domain-models/NPCs/Couatl';
import { IsabelForTests } from '../domain-models/NPCs/IsabelForTests';

export type TTestedCharacters = typeof Isabel;

// IsabelForTests для разработки
export type TTestedNpcs = typeof IsabelForTests | typeof Couatl;
