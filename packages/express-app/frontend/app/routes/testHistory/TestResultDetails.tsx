import { VStack, Box, Code, Text } from '@chakra-ui/react';
import { IHistoricalTestResult } from '@noflake/fsd-gen';

export function TestResultDetails({
	result,
}: {
	result: IHistoricalTestResult;
}) {
	console.log(result);
	return (
		<VStack gap="4" padding="4" align="left">
			<Box>Put links here</Box>
			<Box>
				{result.testResult?.errors?.length ?? 0 > 0 ? (
					<Code size="lg" whiteSpace="pre" display="block">
						{result.testResult?.errors?.join('\n')}
					</Code>
				) : (
					<Text>No errors</Text>
				)}
			</Box>
		</VStack>
	);
}
