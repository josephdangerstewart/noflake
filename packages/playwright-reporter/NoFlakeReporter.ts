import { FacilityError, validateRequiredProperties } from '@noflake/errors';
import { INoFlake, ITestResult, TestResultStatus, TestRunBuildContext } from '@noflake/fsd-gen';
import {
	FullResult,
	Reporter,
	TestCase,
	TestError,
	TestResult,
	TestStatus,
} from '@playwright/test/reporter';

export interface NoFlakeReporterOptions {
	api?: INoFlake;
	projectId?: string;
	commitSha?: string;
	buildContext?: TestRunBuildContext;
}

export class NoFlakeReporter implements Reporter {
	private api: INoFlake;
	private projectId: string;
	private commitSha?: string;
	private buildContext?: TestRunBuildContext;
	private results: ITestResult[];

	constructor(options: NoFlakeReporterOptions = {}) {
		validateRequiredProperties(options, 'api', 'projectId');

		this.api = options.api;
		this.projectId = options.projectId;
		this.commitSha = options.commitSha;
		this.buildContext = options.buildContext;
		this.results = [];
	}

	onTestEnd(test: TestCase, result: TestResult): void {
		if (result.status === 'skipped') {
			return;
		}

		this.results.push({
			errors: result.errors.map(this.serializeError),
			flakeConfidence: 0,
			testId: test.id,
			status: this.mapStatus(result.status),
		});
	}

	onEnd = async (
		result: FullResult,
	): Promise<{ status: FullResult['status'] }> => {
		if (this.results.length) {
			const result = await this.api.submitTestSuiteResult({
				suite: {
					projectId: this.projectId,
					commitSha: this.commitSha,
					runDate: new Date().toISOString(),
					context: this.buildContext,
				},
				results: this.results,
			});

			if (result.error) {
				throw new FacilityError(result.error);
			}
		}

		return { status: result.status };
	};

	private serializeError = (error: TestError): string => {
		let result = '';

		if (error.location) {
			result += `In ${error.location.file} Ln ${error.location.line}, Col ${error.location.column}:\n`;
		}

		if (error.value) {
			result += `${error.value}\n\n`;
		}

		if (error.message) {
			result += `message: ${error.message}\n`;
		}

		if (error.stack) {
			result += `${error.stack}\n`;
		}

		return result.trim();
	};

	private mapStatus = (status: TestStatus): TestResultStatus => {
		const passingStatuses: TestStatus[] = ['passed', 'skipped'];
		if (passingStatuses.includes(status)) {
			return TestResultStatus.pass;
		}

		return TestResultStatus.fail;
	};
}
