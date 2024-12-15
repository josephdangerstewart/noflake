import { ErrorCodes } from './ErrorCodes';
import { FacilityError } from './FacilityError';

export class PermissionError extends FacilityError {
	constructor(requiredPermission: string, scope?: string) {
		super(ErrorCodes.NotAuthorized, `Lacks permission "${requiredPermission}"${scope ? ` on ${scope}` : ''}`);
	}
}
