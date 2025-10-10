import { Character } from './Character';
import { TTacticAction } from './types/character.types';
import { TDuelContext } from './types/common.types';

export class Duel {
  private roundOrder: Character[] = [];
  private duelContext: TDuelContext = {};

  constructor(public first: Character, public second: Character) {}

  run() {
    this.rollRoundOrder();
    let roundNumber = 1;
    let isEnd = false;
    while (!isEnd && roundNumber <= 10) {
      console.log(`раунд ${roundNumber}`);

      isEnd = this.runRound();
      roundNumber++;
    }

    if (!isEnd) {
      const [first, second] = this.roundOrder;
      console.log(
        `ничья: ${first.name}(${first.battleCharacteristics.HP}), ${second.name}(${second.battleCharacteristics.HP})`
      );
    }
  }

  setContext(updProps: Record<string, boolean>) {
    for (const [key, value] of Object.entries(updProps)) {
      this.duelContext[key] = value;
    }
  }

  private rollRoundOrder() {
    const firstInitiative = this.first.rollIninitiative();
    const secondInitiative = this.second.rollIninitiative();

    console.log('ролл инициативы:');

    this.roundOrder = [
      { initiative: firstInitiative, character: this.first },
      { initiative: secondInitiative, character: this.second },
    ]
      .sort((a, b) => b.initiative - a.initiative)
      .map((x, i) => {
        console.log(`> ${i + 1}. ${x.initiative}, ${x.character.name}`);
        return x.character;
      });
  }

  // TODO: 68.24 переделать, чтобы был runTurn. В котором будет ход только одного
  // после каждого хода проверка что оба живы
  private runRound() {
    const first = this.roundOrder[0];
    const second = this.roundOrder[1];

    const firstCharNextTacticAction = first.tactic({ context: this.duelContext, thisChar: first, enemy: second });
    const isSecondAlive = this.applyTacticAction(firstCharNextTacticAction, first, second);
    if (!isSecondAlive) {
      console.log(`${second.name} is dead, ${first.name} is win`);
      return true;
    }

    const secondCharNextTacticAction = second.tactic({ context: this.duelContext, thisChar: second, enemy: first });
    const isFirstAlive = this.applyTacticAction(secondCharNextTacticAction, second, first);
    if (!isFirstAlive) {
      console.log(`${first.name} is dead, ${second.name} is win`);
      return true;
    }

    return false;
  }

  private applyTacticAction(nextTacticAction: TTacticAction, thisChar: Character, enemy: Character): boolean {
    if (nextTacticAction.type === 'attack') {
      const attack = thisChar.getAttack(nextTacticAction.key);
      const { result: attackResult, isCritSuccess } = attack.attackRoll({
        context: this.duelContext,
        thisChar,
        enemy,
      });
      if (attackResult >= enemy.battleCharacteristics.AC) {
        console.log(`attack ${isCritSuccess ? 'CRIT ' : ''}success`);
        const damage = attack.damageRoll({ context: this.duelContext, isCritSuccess, thisChar, enemy });
        return enemy.takeDamage(damage);
      }
      console.log(`attack fail`);
    }

    if (nextTacticAction.type === 'action') {
      const action = thisChar.getAction(nextTacticAction.key);
      action({
        context: this.duelContext,
        setContext: (updProps: Record<string, boolean>) => this.setContext(updProps),
        thisChar,
        enemy,
      });
    }

    return true;
  }
}
