export function count<T>(list: T[], predicate: (item: T) => boolean) {
	return list.filter(predicate).length;
}

export function uniqueValues<TItem>(list: TItem): TItem[];
export function uniqueValues<TItem, TValue = TItem>(list: TItem[], getValue: (item: TItem) => TValue): TValue[];
export function uniqueValues<TItem, TValue = TItem>(list: TItem[], getValue?: (item: TItem) => TValue): TValue[] {
	if (!getValue) {
		return [...new Set(list)] as any[];
	}

	return [...new Set(list.map(getValue))];
}
