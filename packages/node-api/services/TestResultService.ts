import {
	ITestSuiteResult,
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
		result: ITestSuiteResult,
	): Promise<ITestSuiteResult> => {
		validateRequiredProperties(result, 'projectId', 'suiteId', 'results');
		const projectId = parseId(result.projectId);

		await this.database.transaction().execute(async (transaction) => {
			const suiteResultInsert = await transaction
				.insertInto('testSuiteResults')
				.values({
					commitSha: result.commitSha,
					externalId: result.suiteId,
					projectId,
					runDate: parseDate(result.runDate) ?? new Date(),
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
					result.results.map<Insertable<DbTestResult>>((result) => {
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
				BigInt(result.results.length)
			) {
				throw new DatabaseInsertError('testResults');
			}
		});

		return result;
	};
}

const testResultStatusMap: Record<TestResultStatus, number> = {
	[TestResultStatus.pass]: 1,
	[TestResultStatus.fail]: 2,
};

function mapToDbStatus(status: TestResultStatus) {
	return testResultStatusMap[status];
}
