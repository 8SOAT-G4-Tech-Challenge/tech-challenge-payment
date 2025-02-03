/** @type {import('ts-jest').JestConfigWithTsJest} * */
module.exports = {
	testEnvironment: 'node',
	roots: ['<rootDir>'],
	transform: {
		'^.+.tsx?$': ['ts-jest', {}],
	},
	testMatch: ['**/?(*.)+(spec|test).[jt]s?(x)'],
	collectCoverageFrom: [
		'src/**/*.ts',
		'!src/uploads',
		'!src/adapter/driver/routes/*',
		'!src/adapter/driver/routes/doc/*',
		'!src/adapter/driver/server.ts',
		'!src/adapter/driven/infra/lib/*',
		'!**/index.ts',
	],
	testResultsProcessor: 'jest-sonar-reporter',
	coverageThreshold: {
		global: {
			statements: 80,
			branches: 80,
			functions: 80,
			lines: 80,
		},
	},
	moduleNameMapper: {
		'@src/(.*)': ['<rootDir>/src/$1'],
		'@driver/(.*)': ['<rootDir>/src/adapter/driver/$1'],
		'@driven/(.*)': ['<rootDir>/src/adapter/driven/$1'],
		'@models/(.*)': ['<rootDir>/src/core/domain/models/$1'],
		'@routes/(.*)': ['<rootDir>/src/adapter/driver/routes/$1'],
		'@exceptions/(.*)': ['<rootDir>/src/core/application/exceptions/$1'],
		'@controllers/(.*)': ['<rootDir>/src/adapter/driver/controllers/$1'],
		'@services/(.*)': ['<rootDir>/src/core/application/services/$1'],
		'@ports/(.*)': ['<rootDir>/src/core/application/ports/$1'],
		'@application/(.*)': ['<rootDir>/src/core/application/$1'],
		'@domain/(.*)': ['<rootDir>/src/core/domain/$1'],
		'@common/(.*)': ['<rootDir>/src/core/common/$1'],
		'@tests/(.*)': ['<rootDir>/__tests__/$1'],
	},
};
