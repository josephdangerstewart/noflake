import { Box } from '@chakra-ui/react';
import { useVirtualFocusChild, VirtualFocusController, VirtualFocusRoot } from '../VirtualFocus';
import { useCallback, useRef } from 'react';
import { useHotkey } from '../useHotkey';
import { useCombineRefs } from '../useCombineRefs';

export type ListBoxItemState = 'default' | 'selected' | 'emphasized';

export interface ListBoxItemProps {
	state?: ListBoxItemState;
	onToggle?: (isSelected: boolean) => void;
}

interface FocusMeta {
	onToggle: () => void;
	isSelected?: boolean;
}

function ListBoxItem({
	children,
	state,
	onToggle,
}: React.PropsWithChildren<ListBoxItemProps>) {
	const isSelected = state === 'selected';
	const virtualFocusChildRef = useVirtualFocusChild<FocusMeta>({
		onToggle: () => onToggle?.(!isSelected),
		isSelected,
	});

	return (
		<Box
			tabIndex={-1}
			ref={virtualFocusChildRef}
			padding="2"
			paddingLeft="4"
			role="option"
			bg={state === 'selected' ? 'blue.muted' : state === 'emphasized' ? 'blue.subtle' : 'bg'}
			onClick={() => onToggle?.(!isSelected)}
			focusRingColor={isSelected ? 'blue.focusRing' : 'bg'}
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
