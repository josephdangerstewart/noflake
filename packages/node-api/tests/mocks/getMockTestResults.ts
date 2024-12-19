import { ITestResult, TestResultStatus } from "@noflake/fsd-gen";

export function getMockTestResults(count: number, namePrefix: string = 'a cool test', status: TestResultStatus = TestResultStatus.pass): ITestResult[] {
	return Array.from<ITestResult>({ length: count }).fill({
		testId: namePrefix,
		status,
	}).map((result, index) => ({
		...result,
		testId: `${result.testId} ${index}`,
	}));
}
