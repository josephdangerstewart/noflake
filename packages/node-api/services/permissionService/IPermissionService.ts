import { PermissionPolicy } from './PermissionPolicy';
import { Scope } from './Scope';

export interface IPermissionService {
	getPermissions: <TScope extends Scope>(
		scope: TScope,
	) => Promise<PermissionPolicy<TScope['kind']>[]>;
}
