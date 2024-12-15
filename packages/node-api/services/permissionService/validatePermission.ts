import { PermissionError } from '@noflake/errors';
import { NarrowPermissionPolicy, PermissionPolicy } from './PermissionPolicy';
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
		if (policy === '*') {
			return true;
		}

		const requiredPolicyParts = requiredPolicy.split('/');
		const policyParts = policy.split('/');

		for (let i = 0; i < policyParts.length; i++) {
			const policyPart = policyParts[i];
			const requiredPolicyPart = requiredPolicyParts[i];

			if (policyPart === '*' ) {
				return true;
			}

			if (policyPart !== requiredPolicyPart || !requiredPolicyPart) {
				return false;
			}
		}

		return true;
	};
}
