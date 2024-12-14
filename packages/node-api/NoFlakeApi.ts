import type {
	ICreateProjectRequest,
	ICreateProjectResponse,
	INoFlake,
	ISubmitTestSuiteResultResponse,
} from '@noflake/fsd-gen';
import { IServiceResult } from 'facility-core';
import { NoFlakeApiOptions } from './NoFlakeApiOptions';
import { getDatabase } from './database';
import { ProjectService } from './services';
import { validateRequiredProperties } from './services/errors';

export class NoFlakeApi implements INoFlake {
	private projectService: ProjectService;

	constructor(options: NoFlakeApiOptions) {
		const database = getDatabase(options.database);

		this.projectService = new ProjectService(database);
	}

	createProject = async (
		request: ICreateProjectRequest,
	): Promise<IServiceResult<ICreateProjectResponse>> => {
		validateRequiredProperties(request, 'project');

		const project = await this.projectService.createProject(request.project);

		return {
			value: {
				project: project,
			},
		};
	};

	submitTestSuiteResult = async (): Promise<
		IServiceResult<ISubmitTestSuiteResultResponse>
	> => {
		throw new Error('Method not implemented.');
	};
}
