import {
	IHistoricalTestResult,
	ITestResult,
	ITestSuiteRun,
	TestResultStatus,
	TestRunBuildContext,
} from '@noflake/fsd-gen';
import {
	DatabaseError,
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

	public getTestHistory = async (
		testId: string,
		projectId: string,
	): Promise<IHistoricalTestResult[]> => {
		const results = await this.database
			.selectFrom('testResults as t')
			.innerJoin('testSuiteResults as s', 't.suiteResultId', 's.id')
			.select([
				't.id as testId',
				't.errors',
				't.externalId',
				't.flakeConfidence',
				't.status',

				's.id as suiteResultId',
				's.commitSha',
				's.runDate',
				's.context',
			])
			.where('t.externalId', '=', testId)
			.where('s.projectId', '=', parseId(projectId))
			.orderBy('runDate desc')
			.limit(10)
			.execute();

		return results.map((result) => ({
			testResult: {
				testId: result.externalId,
				errors: result.errors,
				flakeConfidence: result.flakeConfidence,
				status: mapToApiStatus(result.status),
			},
			suiteRun: {
				commitSha: result.commitSha,
				projectId,
				runDate: result.runDate.toISOString(),
				context: mapToApiContext(result.context),
			},
		}));
	};

	public submitTestSuiteResult = async (
		suite: ITestSuiteRun,
		results: ITestResult[],
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
					context: mapToDbContext(suite.context ?? TestRunBuildContext.unknown),
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
				testResultsInsert.numInsertedOrUpdatedRows !== BigInt(results.length)
			) {
				throw new DatabaseInsertError('testResults');
			}
		});

		return { suite, results };
	};
}

const testResultStatusMap: Record<TestResultStatus, number> = {
	[TestResultStatus.pass]: 0,
	[TestResultStatus.fail]: 1,
};

const buildContextMap: Record<TestRunBuildContext, number> = {
	[TestRunBuildContext.unknown]: 0,
	[TestRunBuildContext.main]: 1,
	[TestRunBuildContext.pr]: 2,
	[TestRunBuildContext.background]: 3,
	[TestRunBuildContext.local]: 4,
};

function mapToDbContext(context: TestRunBuildContext) {
	return buildContextMap[context];
}

function mapToApiContext(context: number): TestRunBuildContext {
	const result = Object.entries(buildContextMap).find(
		([, dbContext]) => dbContext === context,
	)?.[0];

	if (!result) {
		throw new DatabaseError('could not map db status to api status');
	}

	return result as TestRunBuildContext;
}

function mapToDbStatus(status: TestResultStatus) {
	return testResultStatusMap[status];
}

function mapToApiStatus(status: number): TestResultStatus {
	const result = Object.entries(testResultStatusMap).find(
		([, dbStatus]) => dbStatus === status,
	)?.[0];

	if (!result) {
		throw new DatabaseError('could not map db status to api status');
	}

	return result as TestResultStatus;
}
