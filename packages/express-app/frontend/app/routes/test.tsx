import {
	data,
	LoaderFunctionArgs,
	useLoaderData,
	useParams,
} from 'react-router';
import { Text } from '@chakra-ui/react';
import { LoaderContext } from '../../../LoaderContext';
import { getErrorCode } from '../../util/errorCodes';
import { ListBox, LeftSidebarLayout } from '../../components';
import { Status } from '../../chakra/status';
import { IHistoricalTestResult, TestResultStatus } from '@noflake/fsd-gen';
import { useState } from 'react';

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
	const { testId } = useParams();
	const [selectedItem, setSelectedItem] = useState<IHistoricalTestResult | undefined>();

	return (
		<LeftSidebarLayout>
			<LeftSidebarLayout.Heading size="3xl">
				Test History - {testId}
			</LeftSidebarLayout.Heading>
			<LeftSidebarLayout.Sidebar>
				<ListBox>
					{history.map((item) => (
						<ListBox.Item
							onToggle={(isSelected) =>
								isSelected ? setSelectedItem(item) : setSelectedItem(undefined)
							}
							isSelected={item === selectedItem}
							key={item.suiteRun?.runDate}
						>
							<TestResultItem result={item} />
						</ListBox.Item>
					))}
				</ListBox>
			</LeftSidebarLayout.Sidebar>
			{selectedItem && (
				<LeftSidebarLayout.Main>
					<TestResultDetails result={selectedItem} />
				</LeftSidebarLayout.Main>
			)}
		</LeftSidebarLayout>
	);
}

function TestResultItem({ result }: { result?: IHistoricalTestResult }) {
	const color =
		result?.testResult?.status == TestResultStatus.pass ? 'success' : 'error';

	if (!result?.testResult || !result.suiteRun?.runDate) {
		return null;
	}

	return (
		<Status value={color}>
			<Text>{result?.suiteRun?.runDate}</Text>
		</Status>
	);
}

function TestResultDetails({ result }: { result: IHistoricalTestResult }) {
	return <Text>{result.suiteRun?.context}</Text>;
}
