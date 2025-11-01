import { TTestedCharacters, TTestedNpcs } from './chars-list.types';

export type TDuelLauncherResults = { win: number; lose: number; drawnGame: number };

export type TDuelLauncherRetries = { withUnawares: number; withoutUnawares: number };

export type TDuelLauncherLogSettings = { lose?: true; drawnGame?: true };

export interface IDuelLauncherCreatingProps {
  chars: { tested: TTestedCharacters; enemy: TTestedNpcs };
  retries?: TDuelLauncherRetries;
  logSettings?: TDuelLauncherLogSettings;
}
