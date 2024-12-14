import { Generated, JSONColumnType } from 'kysely';

export interface NoFlakeDatabase {
	projects: Project;
	testSuiteResults: TestSuiteResult;
	testResults: TestResult;
}

export interface Project {
	id: Generated<number>;
	name: string;
}

export interface TestSuiteResult {
	id: Generated<number>;
	externalId: string;
	runDate: string;
	projectId: number;
	commitSha: string;
}

export interface TestResult {
	id: Generated<number>;
	externalId: string;
	suiteResultId: number;
	status: number;
	errors: JSONColumnType<string[]>;
	flakeConfidence: number;
}
