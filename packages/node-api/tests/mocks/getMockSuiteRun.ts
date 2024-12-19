import { ITestSuiteRun, TestRunBuildContext } from '@noflake/fsd-gen';

export function getMockSuiteRun(projectId?: string, commitSha: string = '1234'): ITestSuiteRun {
	const date = new Date();
	date.setMilliseconds(0);
	return {
		commitSha,
		projectId,
		runDate: date.toISOString(),
		context: TestRunBuildContext.unknown,
	};
}
