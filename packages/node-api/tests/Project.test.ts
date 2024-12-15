import { IProject } from '@noflake/fsd-gen';
import { NoFlakeApi } from '../NoFlakeApi';
import { getDatabaseOptions } from './database';
import { MockPermissionService } from './mocks/MockPermissionService';

describe('Projects', () => {
	it('can create a project with write permissions', async () => {
		const api = new NoFlakeApi({
			database: getDatabaseOptions(),
			permissionService: new MockPermissionService('*'),
		});

		const result = await api.createProject({
			project: {
				name: 'My cool project',
			},
		});

		expect(result.value?.project).toEqual<IProject>({
			name: 'My cool project',
			projectId: expect.any(String),
		});
	});
});
