import { Character } from './domain-models/Character';
import { LogKeeper } from './LogKeeper';
import { TTacticAction } from './types/character.types';
import { TDuelContext } from './types/common.types';

interface IDuelCreatingProps {
  testedChar: Character;
  testedEnemy: Character;
  withUnawares?: boolean;
}
export class Duel {
  // private, not changed
  private testedChar: Character;
  private testedEnemy: Character;
  private withUnawares: boolean;

  // private, changed
  private roundOrder: Character[] = [];
  private duelContext: TDuelContext = { turnNumber: 1 };
  private logKeeper: LogKeeper;

  constructor(logKeeper: LogKeeper, duelProps: IDuelCreatingProps) {
    this.logKeeper = logKeeper;
    this.testedChar = duelProps.testedChar;
    this.testedEnemy = duelProps.testedEnemy;
    this.withUnawares = duelProps.withUnawares || false;
  }

  run() {
    let isEnd = false;

    if (this.withUnawares) {
      isEnd = this.runUnawaresRound();
    }

    if (!isEnd) {
      this.rollRoundOrder();

      const turnNumber = this.duelContext.turnNumber;
      while (!isEnd && turnNumber <= 20) {
        const first = this.roundOrder[0];
        const second = this.roundOrder[1];

        isEnd = this.runTurnWithIncrementation(first, second);
        if (isEnd) {
          break;
        }

        isEnd = this.runTurnWithIncrementation(second, first);
      }
    }

    if (!isEnd) {
      const [first, second] = this.roundOrder;
      this.addLog(
        `ничья: ${first.name}(${first.battleCharacteristics.HP}), ${second.name}(${second.battleCharacteristics.HP})`
      );
    }

    this.logKeeper.showLogsIfNeed();
  }

  setContext(updProps: Partial<TDuelContext>) {
    for (const [key, value] of Object.entries(updProps)) {
      this.duelContext[key] = value;
    }
  }

  private runUnawaresRound(): boolean {
    this.addLog('раунд внезапности');
    return this.runTurnWithoutIncrementation(this.testedChar, this.testedEnemy);
  }

  private rollRoundOrder() {
    const firstInitiative = this.testedChar.rollIninitiative();
    const secondInitiative = this.testedEnemy.rollIninitiative();

    this.addLog('ролл инициативы:');

    this.roundOrder = [
      { initiative: firstInitiative, character: this.testedChar },
      { initiative: secondInitiative, character: this.testedEnemy },
    ]
      .sort((a, b) => b.initiative - a.initiative)
      .map((x, i) => {
        this.addLog(`> ${i + 1}. ${x.initiative}, ${x.character.name}`);
        return x.character;
      });
  }

  private runTurnWithIncrementation(char: Character, enemy: Character): boolean {
    this.addLog(`ход ${this.duelContext.turnNumber}`);

    const isEnd = this.runTurnWithoutIncrementation(char, enemy);

    this.setContext({ turnNumber: this.duelContext.turnNumber + 1 });
    return isEnd;
  }

  private runTurnWithoutIncrementation(char: Character, enemy: Character): boolean {
    const nextTacticAction = char.tactic({ context: this.duelContext, enemy });
    const isEnemyAlive = this.applyTacticAction(nextTacticAction, char, enemy);
    let isEnd = false;

    if (!isEnemyAlive) {
      this.addLog(`${enemy.name} is dead, ${char.name} is win`);
      isEnd = true;
    }

    return isEnd;
  }

  private applyTacticAction(nextTacticAction: TTacticAction, thisChar: Character, enemy: Character): boolean {
    this.addLog(`${thisChar.name} use ${nextTacticAction.type.toUpperCase()} '${nextTacticAction.key}'`);

    if (nextTacticAction.type === 'attack') {
      const attack = thisChar.getAttack(nextTacticAction.key);
      const { result: attackResult, isCritSuccess } = attack.attackRoll({
        context: this.duelContext,
        enemy,
      });
      if (attackResult >= enemy.battleCharacteristics.AC) {
        this.addLog('attack success');
        const damage = attack.damageRoll({ context: this.duelContext, isCritSuccess, enemy });
        return enemy.takeDamage(damage);
      }
      this.addLog('attack fail');
    }

    if (nextTacticAction.type === 'action') {
      const action = thisChar.getAction(nextTacticAction.key);
      action({
        context: this.duelContext,
        setContext: (updProps: Record<string, boolean>) => this.setContext(updProps),
        enemy,
      });
    }

    return true;
  }

  private addLog(message: string) {
    this.logKeeper.addLog('DUEL', message);
  }
}
