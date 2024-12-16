import type {
	ICreateProjectRequest,
	ICreateProjectResponse,
	INoFlake,
	ISubmitTestSuiteResultRequest,
	ISubmitTestSuiteResultResponse,
} from '@noflake/fsd-gen';
import {
	validateRequiredProperties,
	catchFacilityErrors,
	ErrorCodes,
	validateCondition,
} from '@noflake/errors';
import { IServiceResult } from 'facility-core';
import { NoFlakeApiOptions } from './NoFlakeApiOptions';
import { getDatabase } from './database';
import {
	IPermissionService,
	ProjectService,
	validatePermission,
	TestResultService,
} from './services';

export class NoFlakeApi implements INoFlake {
	private projectService: ProjectService;
	private testResultService: TestResultService;
	private permissionService: IPermissionService;

	constructor({
		database: databaseOptions,
		permissionService,
	}: NoFlakeApiOptions) {
		const database = getDatabase(databaseOptions);

		this.projectService = new ProjectService(database);
		this.testResultService = new TestResultService(database);
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
	async submitTestSuiteResult(
		request: ISubmitTestSuiteResultRequest,
	): Promise<IServiceResult<ISubmitTestSuiteResultResponse>> {
		validateRequiredProperties(request, 'result');
		validateRequiredProperties(request.result, 'projectId', 'results', 'suiteId');
		validateCondition(request.result.results.length > 0, 'suite results must contain tests');

		for (const testResult of request.result.results) {
			validateRequiredProperties(testResult, 'status', 'testId');
		}

		validatePermission(
			await this.permissionService.getPermissions({ kind: 'project', projectId: request.result.projectId }),
			['write', 'testResults']
		);

		const project = await this.projectService.getProject(request.result.projectId);

		if (!project) {
			return notFound();
		}

		await this.testResultService.submitTestSuiteResult(request.result);

		return { value: {} };
	}
}

function notFound(): IServiceResult<any> {
	return {
		error: {
			code: ErrorCodes.NotFound,
		}
	};
}
