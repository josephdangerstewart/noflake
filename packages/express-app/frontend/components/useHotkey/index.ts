import isHotkey from 'is-hotkey';
import { useCallback, useRef } from 'react';

export function useHotkey<TElement extends HTMLElement = HTMLElement>(map: Record<string, () => void>): React.Ref<TElement | null> {
	const mapRef = useRef(map);
	mapRef.current = map;
	const cleanupRef = useRef<(() => void) | undefined>(undefined);

	return useCallback((el: TElement | null) => {
		cleanupRef.current?.();
		cleanupRef.current = undefined;

		if (el) {
			const cleanups: (() => void)[] = [];
			for (const key of Object.keys(mapRef.current)) {
				const matchesKey = isHotkey(key, { byKey: true });

				const eventHandler = (event: KeyboardEvent) => {
					if (matchesKey(event)) {
						mapRef.current[key]?.();
					}
				}

				el.addEventListener('keydown', eventHandler);
				cleanups.push(() => el.removeEventListener('keydown', eventHandler));
			}

			cleanupRef.current = () => {
				for (const cleanup of cleanups) {
					cleanup();
				}
			}
		}
	}, []);
}
