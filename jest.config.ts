/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import type { Config } from "jest";

const config: Config = {
  // Test environment (Node.js for APIs)
  testEnvironment: "node",

  // Root directories to search for test files
  roots: ["<rootDir>/src", "<rootDir>/test"],

  // Test file patterns
  testMatch: ["**/__tests__/**/*.test.ts", "**/?(*.)+(spec|test).ts"],

  // TypeScript transformer using @swc/jest (faster than ts-jest)
  transform: {
    "^.+\\.ts$": "@swc/jest",
  },

  // Module file extensions
  moduleFileExtensions: ["ts", "js", "json", "node"],

  // Setup files to run before tests
  setupFilesAfterEnv: ["<rootDir>/test/testSetup.ts"],

  // Run tests serially to avoid database conflicts
  maxWorkers: 1,

  // Code coverage configuration
  collectCoverage: false,
  coverageDirectory: "coverage",
  coverageProvider: "v8",

  // Files to collect coverage from
  collectCoverageFrom: ["src/**/*.ts", "!src/**/*.d.ts", "!src/index.ts", "!src/scripts/**"],

  // Paths to ignore in tests
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],

  testEnvironmentOptions: {},
};

export default config;
