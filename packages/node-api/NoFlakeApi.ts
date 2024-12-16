import type {
	ICreateProjectRequest,
	ICreateProjectResponse,
	IGetTestHistoryRequest,
	IGetTestHistoryResponse,
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
		validateRequiredProperties(request, 'suite', 'results');
		validateRequiredProperties(request.suite, 'projectId');
		validateCondition(
			request.results.length > 0,
			'suite results must contain tests',
		);

		for (const testResult of request.results) {
			validateRequiredProperties(testResult, 'status', 'testId');
			validateCondition(
				!testResult.flakeConfidence ||
					(testResult.flakeConfidence >= 0 && testResult.flakeConfidence <= 1),
				'flakeConfidence must be between 0 and 1',
			);
		}

		validatePermission(
			await this.permissionService.getPermissions({
				kind: 'project',
				projectId: request.suite.projectId,
			}),
			['write', 'testResults'],
		);

		const project = await this.projectService.getProject(
			request.suite.projectId,
		);

		if (!project) {
			return notFound();
		}

		await this.testResultService.submitTestSuiteResult(
			request.suite,
			request.results,
		);

		return { value: {} };
	}

	@catchFacilityErrors
	async getTestHistory(
		request: IGetTestHistoryRequest,
	): Promise<IServiceResult<IGetTestHistoryResponse>> {
		validateRequiredProperties(request, 'testId', 'projectId');

		validatePermission(
			await this.permissionService.getPermissions({
				kind: 'project',
				projectId: request.projectId,
			}),
			['read', 'testResults'],
		);

		const project = await this.projectService.getProject(request.projectId);
		if (!project) {
			return notFound();
		}

		return {
			value: {
				history: await this.testResultService.getTestHistory(
					request.testId,
					request.projectId,
				),
			},
		};
	}
}

function notFound(): IServiceResult<any> {
	return {
		error: {
			code: ErrorCodes.NotFound,
		},
	};
}
