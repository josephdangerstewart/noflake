export interface FocusChildNode {
	id: string;
	isActive: boolean;
}

export function getFirst() {
	return getOrderedNodes()[0];
}

export function getLast() {
	const nodes = getOrderedNodes();
	return nodes[nodes.length - 1];
}

export function getActive() {
	return getOrderedNodes().find(x => x.isActive);
}

export function getNext(inc = 1) {
	const nodes = getOrderedNodes();
	const activeIndex = nodes.findIndex(x => x.isActive);

	if (activeIndex === -1) {
		return nodes[0];
	}

	const nextIndex = activeIndex + inc;
	if (nextIndex < 0) {
		return nodes[nodes.length - Math.abs(nextIndex % nodes.length)];
	}

	return nodes[nextIndex % nodes.length];
}

export function getOrderedNodes() {
	if (!document) {
		return [];
	}

	const domNodes = document.querySelectorAll('[data-virtual-focus-node]');
	const orderedIds: {
		isActive: boolean;
		id: string;
	}[] = [];

	for (const item of domNodes) {
		const id = (item as HTMLElement).dataset?.virtualFocusNode;
		
		if (!id) {
			continue;
		}

		const isActive = document.activeElement === item || item.contains(document.activeElement);

		orderedIds.push({
			id,
			isActive,
		});
	}

	return orderedIds;
}