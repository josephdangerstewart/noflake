import { Box } from '@chakra-ui/react';

export interface ListBoxItemProps {
	isSelected?: boolean;
	onToggle?: (isSelected: boolean) => void;
}

function ListBoxItem({
	children,
	isSelected,
	onToggle,
}: React.PropsWithChildren<ListBoxItemProps>) {
	return (
		<Box
			tabIndex={-1}
			padding="2"
			bg={isSelected ? 'bg.emphasized' : 'bg'}
			onClick={() => onToggle?.(!isSelected)}
			cursor="menuitem"
			userSelect="none"
		>
			{children}
		</Box>
	);
}

export function ListBox({ children }: React.PropsWithChildren) {
	return (
		<Box role="listbox" tabIndex={0}>
			{children}
		</Box>
	);
}

ListBox.Item = ListBoxItem;
