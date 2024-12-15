import { PermissionError } from '@noflake/errors';
import {
	getImplicitlyAllowedActions,
	NarrowPermissionPolicy,
	PermissionPolicy,
} from './PermissionPolicy';
import { Scope, ScopeKind } from './Scope';
import { stringifyScope } from './stringifyScope';

export function validatePermission<TScopeKind extends ScopeKind = ScopeKind>(
	permissions: PermissionPolicy<TScopeKind>[],
	requiredPolicy: NarrowPermissionPolicy<TScopeKind>,
	scope?: Scope,
) {
	if (!permissions.some(matchesRequiredPolicy(requiredPolicy))) {
		throw new PermissionError(
			stringifyPolicy(requiredPolicy),
			scope && stringifyScope(scope),
		);
	}
}

function matchesRequiredPolicy<TScopeKind extends ScopeKind>(
	requiredPolicy: NarrowPermissionPolicy<TScopeKind>,
) {
	return (policy: PermissionPolicy<TScopeKind>): boolean => {
		const [requiredAction, requiredEntity] = requiredPolicy;
		const [policyAction, policyEntity] = Array.isArray(policy) ? policy : [policy];

		const matchesAction =
			match(requiredAction, policyAction) ||
			policyAction === '*' ||
			getImplicitlyAllowedActions(policyAction).some((implicitAction) =>
				match(requiredAction, implicitAction),
			);

		const matchesEntity = policyEntity === undefined || match(requiredEntity, policyEntity);

		return matchesAction && matchesEntity;
	};
}

function match(required: string, policy: string) {
	return policy === '*' || required === policy;
}

function stringifyPolicy([action, entity]: NarrowPermissionPolicy) {
	return `${action}/${entity}`;
}
