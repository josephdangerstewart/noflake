import { ScopeKind } from "./Scope";

const actions = ['read', 'write'] as const;

const entityKinds = {
	global: ['projects'],
	project: ['testResults'],
} as const satisfies Record<ScopeKind, string[]>;

export type Action = (typeof actions)[number];

const implicitActionPermissionMap: Record<Action, Action[]> = {
	read: [],
	write: ['read'],
};

/**
 * @param action The action the user is allowed to take
 * @returns A list of actions that must also be allowed if `action` is allowed
 */
export function getImplicitlyAllowedActions(action: Action): Action[] {
	return [action, ...implicitActionPermissionMap[action]];
}

type EntityKindMap = typeof entityKinds;
export type EntityKind<TScopeKind extends ScopeKind = ScopeKind> = EntityKindMap[TScopeKind][number];

export type NarrowPermissionPolicy<TScopeKind extends ScopeKind = ScopeKind> = [Action, EntityKind<TScopeKind>];

/**
 * Permission polices are actions that can be taken on a given entity within a given scope
 */
export type PermissionPolicy<TScopeKind extends ScopeKind = ScopeKind> = [Action | '*', EntityKind<TScopeKind> | '*'] | [Action | '*'] | '*' | Action;
