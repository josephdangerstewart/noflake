import { IServiceResult } from 'facility-core';
import { NoFlakeApi } from '../NoFlakeApi';
import { getDatabaseOptions } from './database';
import { createMockProject } from './mocks/createMockProject';
import { MockPermissionService } from './mocks/MockPermissionService';
import { ISubmitTestSuiteResultResponse, TestResultStatus } from '@noflake/fsd-gen';

describe('TestResult', () => {
	it('can submit test results with write permissions', async () => {
		const mockProject = await createMockProject();

		const api = new NoFlakeApi({
			database: getDatabaseOptions(),
			permissionService: new MockPermissionService(['write', 'testResults']),
		});

		const runDate = new Date();
		const result = await api.submitTestSuiteResult({
			result: {
				projectId: mockProject.projectId,
				suiteId: 'a cool suite',
				commitSha: '12345',
				results: [
					{
						status: TestResultStatus.pass,
						testId: 'sample test',
					}
				],
				runDate: runDate.toISOString(),
			},
		});

		expect(result).toEqual<IServiceResult<ISubmitTestSuiteResultResponse>>({
			value: {},
		});
	});
});
