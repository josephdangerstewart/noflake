import type {
	ICreateProjectRequest,
	ICreateProjectResponse,
	INoFlake,
	ISubmitTestSuiteResultResponse,
} from '@noflake/fsd-gen';
import {
	validateRequiredProperties,
	catchFacilityErrors,
} from '@noflake/errors';
import { IServiceResult } from 'facility-core';
import { NoFlakeApiOptions } from './NoFlakeApiOptions';
import { getDatabase } from './database';
import {
	IPermissionService,
	ProjectService,
	validatePermission,
} from './services';

export class NoFlakeApi implements INoFlake {
	private projectService: ProjectService;
	private permissionService: IPermissionService;

	constructor({
		database: databaseOptions,
		permissionService,
	}: NoFlakeApiOptions) {
		const database = getDatabase(databaseOptions);

		this.projectService = new ProjectService(database);
		this.permissionService = permissionService;
	}

	@catchFacilityErrors
	async createProject(
		request: ICreateProjectRequest,
	): Promise<IServiceResult<ICreateProjectResponse>> {
		validateRequiredProperties(request, 'project');
		validatePermission(
			await this.permissionService.getPermissions({ kind: 'global' }),
			['write', 'projects'],
		);

		const project = await this.projectService.createProject(request.project);

		return {
			value: {
				project: project,
			},
		};
	}

	@catchFacilityErrors
	async submitTestSuiteResult(): Promise<
		IServiceResult<ISubmitTestSuiteResultResponse>
	> {
		throw new Error('Method not implemented.');
	}
}
