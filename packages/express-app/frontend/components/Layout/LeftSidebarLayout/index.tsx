import { Box } from '@chakra-ui/react';
import { findTaggedChildren } from '../../../util/reactUtil';
import { Heading, layoutParts, LeftSidebar, MainContent, SubHeading } from '../parts';

export interface LeftSidebarLayoutProps {
	children: React.ReactNode;
}

export function LeftSidebarLayout({ children }: LeftSidebarLayoutProps) {
	const heading = findTaggedChildren(children, layoutParts.heading)[0];
	const subHeading = findTaggedChildren(children, layoutParts.subHeading)[0];
	const sidebar = findTaggedChildren(children, layoutParts.leftSidebar)[0];
	const main = findTaggedChildren(children, layoutParts.main)[0];

	return (
		<Box display="flex" flexDirection="column" height="100%" width="100%" flexGrow={1}>
			{heading && (
				<Box padding="2">{heading}</Box>
			)}
			{subHeading && (
				<Box padding="2">{subHeading}</Box>
			)}
			<Box display="flex">
				<Box height="100%" width="300px" flexShrink={0}>
					{sidebar}
				</Box>
				<Box height="100%" flexGrow={1}>
					{main}
				</Box>
			</Box>
		</Box>
	);
}

LeftSidebarLayout.Heading = Heading;
LeftSidebarLayout.SubHeading = SubHeading;
LeftSidebarLayout.Sidebar = LeftSidebar;
LeftSidebarLayout.Main = MainContent;
