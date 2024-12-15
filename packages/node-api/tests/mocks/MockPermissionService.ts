import { IPermissionService, PermissionPolicy, Scope } from '../../services';

export class MockPermissionService implements IPermissionService {
	private permissions: PermissionPolicy[];
	constructor(...permissions: PermissionPolicy[]) {
		this.permissions = permissions;
	}

	getPermissions = <TScope extends Scope>(): Promise<PermissionPolicy<TScope['kind']>[]> => {
		return Promise.resolve(this.permissions);
	};
}
