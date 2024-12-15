import { ScopeKind } from "./Scope";

export type Action = 'read' | 'write';

const entityKinds = {
	global: ['projects'],
	project: ['testResults'],
} as const satisfies Record<ScopeKind, string[]>;

type EntityKindMap = typeof entityKinds;
export type EntityKind<TScopeKind extends ScopeKind = ScopeKind> = EntityKindMap[TScopeKind][number];

export type NarrowPermissionPolicy<TScopeKind extends ScopeKind = ScopeKind> = `${Action}/${EntityKind<TScopeKind>}`;

/**
 * Permission polices are actions that can be taken on a given entity within a given scope
 */
export type PermissionPolicy<TScopeKind extends ScopeKind = ScopeKind> = '*' | Action | `${Action}/*` | NarrowPermissionPolicy<TScopeKind>;
