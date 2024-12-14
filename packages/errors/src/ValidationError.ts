import { ErrorCodes } from "./ErrorCodes";
import { FacilityError } from "./FacilityError";

export class ValidationError extends FacilityError {
	constructor(validationFailure: string) {
		super(ErrorCodes.InvalidRequest, `validation failed: ${validationFailure}`);
	}
}
