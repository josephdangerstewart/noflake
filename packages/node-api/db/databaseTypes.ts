import { Generated, JSONColumnType } from 'kysely';

export interface NoFlakeDatabase {
	projects: Project;
	testSuiteRuns: TestSuiteRun;
	testRuns: TestRun;
}

export interface Project {
	id: Generated<number>;
	name: string;
}

export interface TestSuiteRun {
	id: Generated<number>;
	projectId: number;
	commitSha: string;
}

export interface TestRun {
	id: Generated<number>;
	externalId: string;
	suiteRunId: number;
	status: number;
	errors: JSONColumnType<string[]>;
	flakeConfidence: number;
}
