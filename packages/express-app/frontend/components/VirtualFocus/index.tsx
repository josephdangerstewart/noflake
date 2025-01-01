import React, {
	useCallback,
	useContext,
	useEffect,
	useImperativeHandle,
	useMemo,
	useRef,
} from 'react';
import {
	FocusChildNode,
	getActive,
	getFirst,
	getLast,
	getNext,
	getOrderedNodes,
} from './nodeUtil';
import { useDataAttribute } from '../useDataAttribute';
import { useCombineRefs } from '../useCombineRefs';

type Unsubscribe = () => void;
type GiveFocus = () => void;

interface VirtualFocusContextData<TMeta = any> {
	registerChild: (
		id: string,
		giveFocus: GiveFocus,
		meta?: React.RefObject<TMeta>,
	) => Unsubscribe;
}

const VirtualFocusContext = React.createContext<
	VirtualFocusContextData | undefined
>(undefined);

export interface VirtualFocusChild<TMeta = any> {
	focus: GiveFocus;
	meta?: TMeta;
}

export interface VirtualFocusController<TMeta = any> {
	moveNext: () => void;
	movePrevious: () => void;
	moveToStart: () => void;
	moveToEnd: () => void;
	getFocused: () => VirtualFocusChild<TMeta> | undefined;
	find: (predicate: (item: TMeta) => boolean) => VirtualFocusChild | undefined;
}

export interface VirtualFocusRootProps<TMeta = any> {
	ref?: React.Ref<VirtualFocusController<TMeta> | undefined>;
}

/**
 * Represents a complex control with custom focus management that exists outside of the default browser focus behavior
 */
export function VirtualFocusRoot<TMeta = any>({
	children,
	ref = { current: null },
}: React.PropsWithChildren<VirtualFocusRootProps<TMeta>>) {
	const childMap = useRef<
		Record<
			string,
			{
				meta?: React.RefObject<TMeta>;
				focus: GiveFocus;
			}
		>
	>({});
	const rootRef = useRef<HTMLDivElement | null>(null);


	const contextValue = useMemo<VirtualFocusContextData<TMeta>>(
		() => ({
			registerChild: (id: string, focus, meta) => {
				childMap.current[id] = {
					focus,
					meta,
				};
				return () => {
					delete childMap.current[id];
				};
			},
		}),
		[],
	);

	const focusNode = useCallback((node: FocusChildNode | undefined) => {
		if (!node) {
			return;
		}
		childMap.current[node.id]?.focus();
	}, []);

	useImperativeHandle(
		ref,
		() => ({
			moveNext: () => focusNode(getNext()),
			movePrevious: () => focusNode(getNext(-1)),
			moveToStart: () => focusNode(getFirst()),
			moveToEnd: () => focusNode(getLast()),
			getFocused: () => {
				const active = getActive();
				if (active && childMap.current[active.id]) {
					const result = childMap.current[active.id];
					return {
						focus: result.focus,
						meta: result.meta?.current,
					};
				}
				return undefined;
			},
			find: (predicate) => {
				const nodes = getOrderedNodes();
				const found = nodes.find(
					({ id }) =>
						childMap.current[id]?.meta &&
						predicate(childMap.current[id].meta.current),
				);
				if (!found) {
					return;
				}

				const result = childMap.current[found.id];
				return {
					focus: result.focus,
					meta: result.meta?.current,
				};
			},
		}),
		[],
	);

	return (
		<VirtualFocusContext.Provider value={contextValue}>
			<div ref={rootRef}>{children}</div>
		</VirtualFocusContext.Provider>
	);
}

/**
 * A hook that returns a ref to be attached to a virtually focusable DOM node
 */
export function useVirtualFocusChild<TMeta = any>(meta?: TMeta) {
	const context = useContext(VirtualFocusContext);
	const ref = useRef<HTMLDivElement | null>(null);
	const metaRef = useRef<TMeta>(meta);
	metaRef.current = meta;

	if (!context) {
		throw new Error('No virtual focus context given');
	}

	const idRef = useRef(`${Math.random()}${Math.random()}`);
	const { registerChild } = context;

	useEffect(() => {
		return registerChild(
			idRef.current,
			() => {
				ref.current?.focus();
			},
			metaRef,
		);
	}, []);

	const dataAttributeRef = useDataAttribute('virtualFocusNode', idRef.current);

	return useCombineRefs(ref, dataAttributeRef);
}
