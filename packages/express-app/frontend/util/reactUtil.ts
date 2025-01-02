import React from "react";

export function tagComponent<TProps>(
	component: React.ComponentType<TProps>,
	...tags: symbol[]
) {
	(component as any).componentTags = tags;
	return component;
}

export function findTaggedChildren(
	children: React.ReactNode,
	...tags: symbol[]
) {
	if (!children) {
		return [];
	}

	return React.Children.toArray(children).filter(
		(child) =>
			typeof child === 'object' &&
			'type' in child &&
			typeof child.type === 'function' &&
			'componentTags' in child.type &&
			Array.isArray(child.type.componentTags) &&
			hasTags(child.type.componentTags, tags),
	);
}

function hasTags(childTags: symbol[], requiredTags: symbol[])  {
	return requiredTags.every(x => childTags.includes(x));
}
