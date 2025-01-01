import { useCallback, useRef } from "react";

export type RefEffectCleanup = () => void;
export type RefEffect<TItem> = (item: TItem | null | undefined) => RefEffectCleanup | undefined | void;

export function useRefEffect<TItem>(effect: RefEffect<TItem>, deps: any[]) {
	const storedCleanup = useRef<RefEffectCleanup | undefined | void>(undefined);
	return useCallback((item: TItem | null | undefined) => {
		storedCleanup?.current?.();
		storedCleanup.current = effect(item);
	}, deps);
}
