import { IServiceResult } from 'facility-core';
import { NoFlakeApi } from '../NoFlakeApi';
import { getDatabaseOptions } from './database';
import { createMockProject } from './mocks/createMockProject';
import { MockPermissionService } from './mocks/MockPermissionService';
import {
	IGetTestHistoryResponse,
	ISubmitTestSuiteResultResponse,
	TestResultStatus,
} from '@noflake/fsd-gen';
import { verifyResponse } from './testUtility';
import { getMockSuiteRun } from './mocks/getMockSuiteRun';
import { getMockTestResults } from './mocks/getMockTestResults';

describe('TestResult', () => {
	it('can submit test results with write permissions', async () => {
		const mockProject = await createMockProject();

		const api = new NoFlakeApi({
			database: getDatabaseOptions(),
			permissionService: new MockPermissionService(['write', 'testResults']),
		});

		const result = await api.submitTestSuiteResult({
			suite: {
				projectId: mockProject.projectId,
				commitSha: '12345',
				runDate: new Date().toISOString(),
			},
			results: [
				{
					status: TestResultStatus.pass,
					testId: 'sample test',
				},
			],
		});

		expect(result).toEqual<IServiceResult<ISubmitTestSuiteResultResponse>>({
			value: {},
		});
	});

	it('can get test history', async () => {
		const project = await createMockProject();
		const api = new NoFlakeApi({
			database: getDatabaseOptions(),
			permissionService: new MockPermissionService('*'),
		});

		const suiteRun1 = getMockSuiteRun(project.projectId, '1234');
		verifyResponse(
			await api.submitTestSuiteResult({
				suite: suiteRun1,
				results: getMockTestResults(10, 'cool test', TestResultStatus.pass),
			}),
		);

		const suiteRun2 = getMockSuiteRun(project.projectId, '5678');
		verifyResponse(
			await api.submitTestSuiteResult({
				suite: suiteRun2,
				results: getMockTestResults(10, 'cool test', TestResultStatus.fail),
			}),
		);

		const result = await api.getTestHistory({
			testId: 'cool test 0',
			projectId: project.projectId,
		});

		expect(result).toMatchObject<IServiceResult<IGetTestHistoryResponse>>({
			value: {
				history: [
					{
						suiteRun: suiteRun1,
						testResult: {
							status: TestResultStatus.pass,
							testId: 'cool test 0',
						},
					},
					{
						suiteRun: suiteRun2,
						testResult: {
							status: TestResultStatus.fail,
							testId: 'cool test 0',
						},
					},
				],
			},
		});
	});
});
