/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
	testEnvironment: 'node',
	transform: {
		'^.+.tsx?$': ['ts-jest', {}],
	},
	testMatch: ['<rootDir>/tests/**/*.test.ts'],
    setupFilesAfterEnv: ['<rootDir>/tests/database.ts'],
};
