import {
	data,
	LoaderFunctionArgs,
	useLoaderData,
	useParams,
} from 'react-router';
import { Heading, Text } from '@chakra-ui/react';
import { LoaderContext } from '../../../LoaderContext';
import { getErrorCode } from '../../util/errorCodes';
import { ListBox } from '../../components';
import { Status } from '../../chakra/status';
import { IHistoricalTestResult, TestResultStatus } from '@noflake/fsd-gen';

export const loader = async ({
	context,
	params,
}: LoaderFunctionArgs<LoaderContext>) => {
	const { projectId, testId } = params;
	const { api } = context ?? {};

	if (!projectId || !testId) {
		return data(null, { status: 404 });
	}

	if (!api) {
		return data(null, { status: 500 });
	}

	const history = await api.getTestHistory({
		projectId,
		testId,
	});

	if (history.error) {
		return data(null, { status: getErrorCode(history.error.code) });
	}

	return { history: history.value?.history ?? [] };
};

export default function TestPage() {
	const { history } = useLoaderData<typeof loader>() ?? { history: [] };
	const { testId, projectId } = useParams();

	return (
		<div>
			<Heading size="3xl">
				{projectId}: {testId}
			</Heading>
			<ListBox>
				{history.map((item) => (
					<ListBox.Item key={item.suiteRun?.runDate}>
						<TestResultItem result={item} />
					</ListBox.Item>
				))}
			</ListBox>
		</div>
	);
}

function TestResultItem({ result }: { result?: IHistoricalTestResult }) {
	const color = result?.testResult?.status == TestResultStatus.pass ? 'success' : 'error';

	if (!result?.testResult || !result.suiteRun?.runDate) {
		return null;
	}

	return (
		<Status value={color}>
			<Text>{result?.suiteRun?.runDate}</Text>
		</Status>
	)
}
