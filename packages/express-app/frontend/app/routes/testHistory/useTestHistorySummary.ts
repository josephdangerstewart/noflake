import { IHistoricalTestResult, TestResultStatus } from '@noflake/fsd-gen';
import { useMemo } from 'react';
import { count, uniqueValues } from '../../../util/listUtil';

export function useTestHistorySummary(history: IHistoricalTestResult[]) {
	const failedCount = useMemo(
		() =>
			count(
				history,
				(item) => item.testResult?.status !== TestResultStatus.pass,
			),
		[history],
	);

	const uniqueErrorsCount = useMemo(
		() =>
			uniqueValues(
				history.filter((x) => x.testResult?.status === TestResultStatus.fail),
				(item) => JSON.stringify(item.testResult?.errors).trim().toLowerCase(),
			).length,
		[history],
	);

	return {
		failedCount,
		uniqueErrorsCount,
	};
}
