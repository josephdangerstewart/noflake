import { Box } from '@chakra-ui/react';
import { useVirtualFocusChild, VirtualFocusController, VirtualFocusRoot } from '../VirtualFocus';
import { useCallback, useRef } from 'react';
import { useHotkey } from '../useHotkey';
import { useCombineRefs } from '../useCombineRefs';

export interface ListBoxItemProps {
	isSelected?: boolean;
	onToggle?: (isSelected: boolean) => void;
}

interface FocusMeta {
	onToggle: () => void;
	isSelected?: boolean;
}

function ListBoxItem({
	children,
	isSelected,
	onToggle,
}: React.PropsWithChildren<ListBoxItemProps>) {
	const virtualFocusChildRef = useVirtualFocusChild<FocusMeta>({
		onToggle: () => onToggle?.(!isSelected),
		isSelected,
	});

	return (
		<Box
			tabIndex={-1}
			ref={virtualFocusChildRef}
			padding="2"
			role="option"
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
	const focusControl = useRef<VirtualFocusController<FocusMeta> | undefined>(undefined);

	const hotkeyRef = useHotkey({
		'down': () => focusControl.current?.moveNext(),
		'up': () => focusControl.current?.movePrevious(),
		'home': () => focusControl.current?.moveToStart(),
		'end': () => focusControl.current?.moveToEnd(),
		'enter': () => focusControl.current?.getFocused()?.meta?.onToggle(),
		'space': () => focusControl.current?.getFocused()?.meta?.onToggle(),
	});

	const boxElementRef = useRef<HTMLDivElement | null>(null);

	const onFocus = useCallback((event: React.FocusEvent) => {
		if (!boxElementRef.current || event.target !== boxElementRef.current) {
			return;
		}

		const activeItem = focusControl.current?.find(x => x.isSelected ?? false);
		if (activeItem) {
			activeItem.focus();
		} else {
			focusControl.current?.moveNext();
		}
	}, []);

	const boxRef = useCombineRefs(boxElementRef, hotkeyRef);

	return (
		<VirtualFocusRoot ref={focusControl}>
			<Box role="listbox" tabIndex={0} ref={boxRef} onFocus={onFocus}>
				{children}
			</Box>
		</VirtualFocusRoot>
	);
}

ListBox.Item = ListBoxItem;
