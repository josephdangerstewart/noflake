import { ICreateProjectResponse, IProject } from '@noflake/fsd-gen';
import { NoFlakeApi } from '../NoFlakeApi';
import { getDatabaseOptions } from './database';
import { MockPermissionService } from './mocks/MockPermissionService';
import { IServiceResult } from 'facility-core';
import { ErrorCodes } from '@noflake/errors';

describe('Projects', () => {
	it('can create a project with write permissions', async () => {
		const api = new NoFlakeApi({
			database: getDatabaseOptions(),
			permissionService: new MockPermissionService(['write', 'projects']),
		});

		const result = await api.createProject({
			project: {
				name: 'My cool project',
			},
		});

		expect(result).toEqual<IServiceResult<ICreateProjectResponse>>({
			value: {
				project: {
					name: 'My cool project',
					projectId: expect.any(String),
				}
			}
		});
	});

	it('cannot create a project with insufficient permissions', async () => {
		const api = new NoFlakeApi({
			database: getDatabaseOptions(),
			permissionService: new MockPermissionService(['read', 'projects'], ['*', 'testResults']),
		});

		const result = await api.createProject({
			project: {
				name: 'My cool project',
			},
		});

		expect(result).toMatchObject<IServiceResult<IProject>>({
			error: {
				code: ErrorCodes.NotAuthorized,
			},
		});
	});
});
