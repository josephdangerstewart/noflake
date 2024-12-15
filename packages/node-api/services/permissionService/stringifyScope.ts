import { Scope } from './Scope';

export function stringifyScope(scope: Scope): string {
	if (scope.kind === 'global') {
		return 'global';
	}

	if (scope.kind === 'project') {
		return  `project ${scope.projectId}`;
	}

	return `${(scope as any).kind} scope`;
}
