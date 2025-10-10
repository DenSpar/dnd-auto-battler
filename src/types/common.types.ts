export enum EDices {
  D4 = 'D4',
  D6 = 'D6',
  D8 = 'D8',
  D10 = 'D10',
  D12 = 'D12',
  D20 = 'D20',
  D100 = 'D100',
}

export type TDices = `${EDices}`;

export type TDuelContext = {
  turnNumber: number;

  darkness?: boolean;
};
