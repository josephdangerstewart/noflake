import { Box } from '@chakra-ui/react';

export interface ListBoxItemProps {
	isSelected?: boolean;
}

function ListBoxItem({
	children,
}: React.PropsWithChildren<ListBoxItemProps>) {
	return <Box>{children}</Box>;
}

export function ListBox({ children }: React.PropsWithChildren) {
	return <Box role="listbox">{children}</Box>;
}

ListBox.Item = ListBoxItem;
