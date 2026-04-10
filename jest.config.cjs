module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.test.ts", "**/tests/integration/**/*.test.ts"],
  modulePathIgnorePatterns: ["<rootDir>/build", "<rootDir>/node_modules"],
  setupFiles: ["<rootDir>/tests/jest.setup.ts"],
};
