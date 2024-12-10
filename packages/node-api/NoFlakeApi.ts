import type {
	ICreateProjectResponse,
	INoFlake,
	ISubmitTestSuiteResultResponse,
} from '@noflake/fsd-gen';
import { IServiceResult } from 'facility-core';

export class NoFlakeApi implements INoFlake {
	createProject(): Promise<IServiceResult<ICreateProjectResponse>> {
		throw new Error('Method not implemented.');
	}

	submitTestSuiteResult(): Promise<
		IServiceResult<ISubmitTestSuiteResultResponse>
	> {
		throw new Error('Method not implemented.');
	}
}
