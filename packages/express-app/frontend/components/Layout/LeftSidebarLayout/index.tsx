import { findLayoutPart, Heading, layoutParts, LeftSidebar, MainContent } from '../parts';

export interface LeftSidebarLayoutProps {
	children: React.ReactNode;
}

export function LeftSidebarLayout({ children }: LeftSidebarLayoutProps) {
	console.log(findLayoutPart(children, layoutParts.heading));
	return <>{children}</>;
}

LeftSidebarLayout.Heading = Heading;
LeftSidebarLayout.Sidebar = LeftSidebar;
LeftSidebarLayout.Main = MainContent;
