import React from 'react';
import { tagComponent } from '../../../util/reactUtil';

export const layoutParts = {
	leftSidebar: Symbol('leftSidebar'),
	heading: Symbol('heading'),
	subHeading: Symbol('subHeading'),
	main: Symbol('main'),
} as const;

export type LayoutPart = (typeof layoutParts)[keyof typeof layoutParts];

export function Heading({
	children,
}: React.PropsWithChildren) {
	return <>{children}</>;
}

tagComponent(Heading, layoutParts.heading);

export function SubHeading({
	children,
}: React.PropsWithChildren) {
	return <>{children}</>;
}

tagComponent(SubHeading, layoutParts.subHeading);

export function LeftSidebar({ children }: React.PropsWithChildren) {
	return <>{children}</>;
}
tagComponent(LeftSidebar, layoutParts.leftSidebar);

export function MainContent({ children }: React.PropsWithChildren) {
	return <>{children}</>;
}

tagComponent(MainContent, layoutParts.main);
