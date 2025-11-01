import { EDices, TDices } from './types/common.types';

export function roll20(options?: { advantage?: boolean; disadvantage?: boolean }) {
  const rolls = [roll(EDices.D20), roll(EDices.D20)];

  if (options?.advantage && !options?.disadvantage) {
    rolls.sort((a, b) => b - a);
  }
  if (options?.disadvantage && !options?.advantage) {
    rolls.sort((a, b) => a - b);
  }

  const result = rolls[0];
  return { result, isCritSuccess: result === 20 };
}

export function roll(dices: `${number}${TDices}` | `${TDices}`): number {
  const data = dices.split('D');
  const maxValue = Number(data.pop());
  let numerous = Number(data.pop()) || 1;

  if (!maxValue) throw new Error(`roll | invalid dice - ${dices}`);

  let result = 0;
  while (numerous) {
    result += rollOneDice(maxValue);
    numerous--;
  }

  return result;
}

function rollOneDice(maxValue: number): number {
  // eslint-disable-next-line sonarjs/pseudo-random
  return Math.ceil(Math.random() * maxValue);
}
