import { Duel } from './Duel';
import { LogKeeper } from './LogKeeper';
import { TTestedCharacters, TTestedNpcs } from './types/chars-list.types';
import {
  IDuelLauncherCreatingProps,
  TDuelLauncherLogSettings,
  TDuelLauncherResults,
  TDuelLauncherRetries,
} from './types/duel-launcher.types';

export class DuelLauncher {
  // incomings args
  private TestedChar: TTestedCharacters;
  private TestedEnemy: TTestedNpcs;
  private retries: TDuelLauncherRetries;
  private logSettings: TDuelLauncherLogSettings;

  // private props
  private results: { withUnawares: TDuelLauncherResults; withoutUnawares: TDuelLauncherResults };
  private logKeeper: LogKeeper;

  constructor(props: IDuelLauncherCreatingProps) {
    this.TestedChar = props.chars.tested;
    this.TestedEnemy = props.chars.enemy;
    this.retries = props.retries || { withUnawares: 10, withoutUnawares: 10 };
    this.logSettings = props.logSettings || {};

    this.results = {
      withUnawares: { win: 0, lose: 0, drawnGame: 0 },
      withoutUnawares: { win: 0, lose: 0, drawnGame: 0 },
    };
    this.logKeeper = new LogKeeper(true);
  }

  run() {
    this.runDuelWithSettings(true, this.retries.withUnawares);
    this.runDuelWithSettings(false, this.retries.withoutUnawares);

    this.unshiftLog(
      `WITHOUT unawares: WINS-${this.results.withoutUnawares.win}, LOSES-${this.results.withoutUnawares.lose}, DRAWN GAMES-${this.results.withoutUnawares.drawnGame}`
    );
    this.unshiftLog(
      `   WITH unawares: WINS-${this.results.withUnawares.win}, LOSES-${this.results.withUnawares.lose}, DRAWN GAMES-${this.results.withUnawares.drawnGame}`
    );
    this.unshiftLog(`${this.TestedChar.name} vs ${this.TestedEnemy.name}`);

    this.logKeeper.showLogsIfNeed();
  }

  private runDuelWithSettings(withUnawares: boolean, retries: number) {
    this.addLog(`Tries ${withUnawares ? 'with' : 'without'} unawares`);

    for (let i = 0; i < retries; i++) {
      const duelLogKeeper = new LogKeeper();
      const testedChar = new this.TestedChar(duelLogKeeper);
      const testedEnemy = new this.TestedEnemy(duelLogKeeper);

      new Duel(duelLogKeeper, { testedChar, testedEnemy, withUnawares }).run();

      if (testedChar.battleCharacteristics.HP < 0) {
        this.addResultLose(withUnawares);
        this.addLog(`${testedChar.name} lose in duel. Try ${i + 1}/${retries}`);

        if (this.logSettings.lose) {
          duelLogKeeper.prettyLogs.forEach((log) => {
            this.addLog(`>>> ${log}`);
          });
        }
      } else if (testedEnemy.battleCharacteristics.HP < 0) {
        this.addResultWin(withUnawares);
      } else {
        this.addResultDrawnGame(withUnawares);
        if (this.logSettings.drawnGame) {
          duelLogKeeper.prettyLogs.forEach((log) => {
            this.addLog(`>>> ${log}`);
          });
        }
      }
    }
  }

  private addResultWin(withUnawares: boolean) {
    if (withUnawares) {
      this.results.withUnawares.win++;
    } else {
      this.results.withoutUnawares.win++;
    }
  }

  private addResultLose(withUnawares: boolean) {
    if (withUnawares) {
      this.results.withUnawares.lose++;
    } else {
      this.results.withoutUnawares.lose++;
    }
  }

  private addResultDrawnGame(withUnawares: boolean) {
    if (withUnawares) {
      this.results.withUnawares.drawnGame++;
    } else {
      this.results.withoutUnawares.drawnGame++;
    }
  }

  private addLog(message: string) {
    this.logKeeper.addLog('DuelLauncher', message);
  }

  private unshiftLog(message: string) {
    this.logKeeper.unshiftLog('DuelLauncher', message);
  }
}
