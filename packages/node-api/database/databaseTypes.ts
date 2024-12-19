import { Generated, JSONColumnType } from 'kysely';

export interface NoFlakeDatabase {
	projects: DbProject;
	testSuiteResults: DbTestSuiteResult;
	testResults: DbTestResult;
}

export interface DbProject {
	id: Generated<bigint>;
	name: string;
}

export interface DbTestSuiteResult {
	id: Generated<bigint>;
	runDate: Date;
	projectId: bigint;
	commitSha?: string;
	context: number;
}

export interface DbTestResult {
	id: Generated<bigint>;
	externalId: string;
	suiteResultId: bigint;
	status: number;
	errors: JSONColumnType<string[]>;
	flakeConfidence: number;
}
