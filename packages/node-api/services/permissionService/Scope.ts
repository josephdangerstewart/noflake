export interface ProjectScope {
	kind: 'project';
	projectId: string;
}

export interface GlobalScope {
	kind: 'global';
}

export type Scope = ProjectScope | GlobalScope;
export type ScopeKind = Scope['kind'];
