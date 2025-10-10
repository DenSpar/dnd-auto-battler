/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

import { collectCoverageFrom } from './collect-coverage-from';

console.log('Loaded jest-performance.config.ts');

export default {
  rootDir: '../../..',
  displayName: {
    name: 'PERFORMANCE TESTS',
    color: 'red',
  },
  preset: 'ts-jest',
  moduleFileExtensions: ['js', 'json', 'ts'],
  roots: [`<rootDir>/src/`],
  testRegex: '.*\\.(performance-test)\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  testEnvironment: 'node',
  collectCoverageFrom,
  coverageDirectory: '<rootDir>/coverage/performance',
  setupFiles: ['<rootDir>/tests/configs/jest/jest.setup.ts'],
  reporters: [
    'default',
    [
      'jest-junit',
      {
        suiteNameTemplate: '{filepath}',
        outputDirectory: '<rootDir>/tests/results/.',
        outputName: 'TEST-RESULTS-performance.xml',
      },
    ],
  ],

  testTimeout: 5000,
};
