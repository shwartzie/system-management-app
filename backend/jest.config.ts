import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    verbose: true,
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'], // Path to setup file
    transform: {
        '^.+\\.tsx?$': 'ts-jest', // Transform TypeScript files
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'], // File extensions Jest will process
    testMatch: ['**/?(*.)+(spec|test).[tj]s?(x)'], // Pattern to find test files
};

export default config;
