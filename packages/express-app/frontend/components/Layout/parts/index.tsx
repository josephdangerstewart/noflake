import { HeadingProps, Heading as ChakraHeading } from '@chakra-ui/react';
import React from 'react';
import { tagComponent } from '../../../util/reactUtil';

export const layoutParts = {
	leftSidebar: Symbol('leftSidebar'),
	heading: Symbol('heading'),
	main: Symbol('main'),
} as const;

export type LayoutPart = (typeof layoutParts)[keyof typeof layoutParts];

export function Heading({
	children,
	...rest
}: React.PropsWithChildren<HeadingProps>) {
	return <ChakraHeading {...rest}>{children}</ChakraHeading>;
}

tagComponent(Heading, layoutParts.heading);

export function LeftSidebar({ children }: React.PropsWithChildren) {
	return <>{children}</>;
}
tagComponent(LeftSidebar, layoutParts.leftSidebar);

export function MainContent({ children }: React.PropsWithChildren) {
	return <>{children}</>;
}

tagComponent(MainContent, layoutParts.main);
