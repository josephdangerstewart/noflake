import { useCallback } from "react";

export function useCombineRefs<TRef>(...refs: React.Ref<TRef>[]) {
	return useCallback((item: TRef) => {
		for (const ref of refs) {
			if (typeof ref === 'function') {
				ref(item);
			} else if (ref) {
				ref.current = item;
			}
		}
	}, refs);
}
