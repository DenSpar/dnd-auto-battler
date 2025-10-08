import { Duel } from './Duel';
import { LogKeeper } from './LogKeeper';
import { TTestedCharacters } from './types/tested-chars.types';
import { TTestedEnemies } from './types/tested-enemies.types';

type TResult = { win: number; lose: number; drawnGame: number };
interface IDuelLauncherCreatingProps {
  chars: { tested: TTestedCharacters; enemy: TTestedEnemies };
  retries?: { withUnawares: number; withoutUnawares: number };
}
export class DuelLauncher {
  // incomings args
  private TestedChar: TTestedCharacters;
  private TestedEnemy: TTestedEnemies;
  private retries: { withUnawares: number; withoutUnawares: number };

  // private props
  private results: { withUnawares: TResult; withoutUnawares: TResult };
  private logKeeper: LogKeeper;

  constructor(props: IDuelLauncherCreatingProps) {
    this.TestedChar = props.chars.tested;
    this.TestedEnemy = props.chars.enemy;
    this.retries = props.retries || { withUnawares: 10, withoutUnawares: 10 };

    this.results = {
      withUnawares: { win: 0, lose: 0, drawnGame: 0 },
      withoutUnawares: { win: 0, lose: 0, drawnGame: 0 },
    };
    this.logKeeper = new LogKeeper(true);
  }

  run() {
    this.runDuelWithSettings(true, this.retries.withUnawares);
    this.runDuelWithSettings(false, this.retries.withoutUnawares);

    this.addLog(
      `   WITH unawares: WINS-${this.results.withUnawares.win}, LOSES-${this.results.withUnawares.lose}, DRAWN GAMES-${this.results.withUnawares.drawnGame}`
    );
    this.addLog(
      `WITHOUT unawares: WINS-${this.results.withoutUnawares.win}, LOSES-${this.results.withoutUnawares.lose}, DRAWN GAMES-${this.results.withoutUnawares.drawnGame}`
    );
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

        const defeatDuelLogs = duelLogKeeper.prettyLogs;
        defeatDuelLogs.forEach((log) => {
          this.addLog(`>>> ${log}`);
        });
      } else if (testedEnemy.battleCharacteristics.HP < 0) {
        this.addResultWin(withUnawares);
      } else {
        this.addResultDrawnGame(withUnawares);
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
}
