import { HeadingProps, Heading as ChakraHeading } from "@chakra-ui/react";
import React from "react";

export const layoutParts = {
	sidebar: Symbol('sidebar'),
	leftSidebar: Symbol('leftSidebar'),
	heading: Symbol('heading'),
	main: Symbol('main'),
} as const;

export type LayoutPart = (typeof layoutParts)[keyof (typeof layoutParts)];

export function Heading({ children, ...rest }: React.PropsWithChildren<HeadingProps>) {
	return <ChakraHeading {...rest}>{children}</ChakraHeading>;
}

Heading.layoutPart = layoutParts.heading;

export function LeftSidebar({ children }: React.PropsWithChildren) {
	return <>{children}</>;
}

LeftSidebar.layoutPart = layoutParts.leftSidebar;

export function MainContent({ children }: React.PropsWithChildren) {
	return <>{children}</>;
}

MainContent.layoutPart = layoutParts.main;

export function findLayoutPart(children: React.ReactNode, part: LayoutPart) {
	console.log(part);
	return React.Children.toArray(children).find(child => typeof child === 'object');
}
