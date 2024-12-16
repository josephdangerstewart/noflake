import {
	ITestResult,
	ITestSuiteRun,
	TestResultStatus,
} from '@noflake/fsd-gen';
import {
	DatabaseInsertError,
	validateRequiredProperties,
} from '@noflake/errors';
import { Database } from '../database';
import { Insertable } from 'kysely';
import { DbTestResult } from '../database/databaseTypes';
import { parseDate, parseId } from './serviceUtility';

export class TestResultService {
	private database: Database;

	constructor(database: Database) {
		this.database = database;
	}

	public submitTestSuiteResult = async (
		suite: ITestSuiteRun,
		results: ITestResult[]
	): Promise<{ suite: ITestSuiteRun; results: ITestResult[] }> => {
		validateRequiredProperties(suite, 'projectId');
		const projectId = parseId(suite.projectId);

		await this.database.transaction().execute(async (transaction) => {
			const suiteResultInsert = await transaction
				.insertInto('testSuiteResults')
				.values({
					commitSha: suite.commitSha,
					projectId,
					runDate: parseDate(suite.runDate) ?? new Date(),
				})
				.executeTakeFirst();

			if (
				suiteResultInsert.numInsertedOrUpdatedRows !== 1n ||
				suiteResultInsert.insertId === undefined
			) {
				throw new DatabaseInsertError('testSuiteResults');
			}

			const testResultsInsert = await transaction
				.insertInto('testResults')
				.values(
					results.map<Insertable<DbTestResult>>((result) => {
						validateRequiredProperties(result, 'status', 'testId');
						return {
							errors: JSON.stringify(result.errors ?? []),
							externalId: result.testId,
							flakeConfidence: result.flakeConfidence ?? 0,
							status: mapToDbStatus(result.status),
							suiteResultId: suiteResultInsert.insertId!,
						};
					}),
				)
				.executeTakeFirst();

			if (
				testResultsInsert.numInsertedOrUpdatedRows !==
				BigInt(results.length)
			) {
				throw new DatabaseInsertError('testResults');
			}
		});

		return { suite, results };
	};
}

const testResultStatusMap: Record<TestResultStatus, number> = {
	[TestResultStatus.pass]: 1,
	[TestResultStatus.fail]: 2,
};

function mapToDbStatus(status: TestResultStatus) {
	return testResultStatusMap[status];
}
