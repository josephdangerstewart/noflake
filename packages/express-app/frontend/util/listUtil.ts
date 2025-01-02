export function count<T>(list: T[], predicate: (item: T) => boolean) {
	return list.filter(predicate).length;
}
