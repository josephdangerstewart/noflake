import { PermissionError } from '@noflake/errors';
import { getImplicitlyAllowedActions, isAction, NarrowPermissionPolicy, PermissionPolicy } from './PermissionPolicy';
import { Scope, ScopeKind } from './Scope';
import { stringifyScope } from './stringifyScope';

export function validatePermission<TScopeKind extends ScopeKind = ScopeKind>(
	permissions: PermissionPolicy<TScopeKind>[],
	requiredPolicy: NarrowPermissionPolicy<TScopeKind>,
	scope?: Scope
) {
	if (!permissions.some(matchesRequiredPolicy(requiredPolicy))) {
		throw new PermissionError(requiredPolicy, scope && stringifyScope(scope));
	}
}

function matchesRequiredPolicy<TScopeKind extends ScopeKind>(requiredPolicy: NarrowPermissionPolicy<TScopeKind>) {
	return (policy: PermissionPolicy<TScopeKind>): boolean => {
		const [requiredAction, requiredEntity = '*'] = requiredPolicy.split('/');
		const [actionPolicyPart, entityPolicyPart = '*'] = policy.split('/');

		if (actionPolicyPart === '*') {
			return true;
		}

		if (!isAction(requiredAction) || !isAction(actionPolicyPart)) {
			return false;
		}

		if (requiredAction !== actionPolicyPart || !getImplicitlyAllowedActions(actionPolicyPart).includes(requiredAction)) {
			return false;
		}

		return entityPolicyPart === '*' || entityPolicyPart === requiredEntity;
	};
}
