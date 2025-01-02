import { VStack, Box, Code, Span, Text } from '@chakra-ui/react';
import { IHistoricalTestResult } from '@noflake/fsd-gen';
import React from 'react';

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
					<Code size="lg">
						{result.testResult?.errors?.map((error, index) => (
							<React.Fragment key={`${error}${index}`}>
								<Span>{error}</Span>
								<br />
							</React.Fragment>
						))}
					</Code>
				) : (
					<Text>No errors</Text>
				)}
			</Box>
		</VStack>
	);
}
