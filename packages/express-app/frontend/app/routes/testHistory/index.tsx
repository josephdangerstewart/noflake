import { useState } from 'react';
import {
	useLoaderData,
	useParams,
} from 'react-router';
import { Text, Heading, Span, HStack } from '@chakra-ui/react';
import { IHistoricalTestResult, TestResultStatus } from '@noflake/fsd-gen';
import { ListBox, LeftSidebarLayout } from '../../../components';
import { Status } from '../../../chakra/status';
import { TestResultDetails } from './TestResultDetails';
import type { Loader } from './loader';
import { useTestHistorySummary } from './useTestHistorySummary';

export { loader } from './loader';

export default function TestPage() {
	const { history } = useLoaderData<Loader>() ?? { history: [] };
	const { testId } = useParams();
	const [selectedItem, setSelectedItem] = useState<
		IHistoricalTestResult | undefined
	>();

	const { uniqueErrorsCount, failedCount } = useTestHistorySummary(history);

	return (
		<LeftSidebarLayout>
			<LeftSidebarLayout.Heading>
				<Heading size="3xl">Test History - {testId}</Heading>
			</LeftSidebarLayout.Heading>
			<LeftSidebarLayout.SubHeading>
				<HStack gap="6">
					<Heading size="xl">
						last <Span textDecoration="underline">{history.length}</Span> runs
					</Heading>
					<Heading size="xl">
						<Span textDecoration="underline">{failedCount}</Span> failed
					</Heading>
					{uniqueErrorsCount > 0 && (
						<Heading size="xl">
							<Span textDecoration="underline">{uniqueErrorsCount}</Span>{' '}
							distinct error{uniqueErrorsCount > 1 ? 's' : ''}
						</Heading>
					)}
				</HStack>
			</LeftSidebarLayout.SubHeading>
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
