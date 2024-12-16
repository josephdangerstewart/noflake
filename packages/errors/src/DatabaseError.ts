import { ErrorCodes } from './ErrorCodes';
import { FacilityError } from './FacilityError';

export class DatabaseError extends FacilityError {
	constructor(message: string) {
		super(ErrorCodes.InternalError, message);
	}
}
