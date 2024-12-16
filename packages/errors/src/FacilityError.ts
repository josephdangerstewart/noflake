import { IServiceError, IServiceResult } from 'facility-core';
import { ErrorCodes } from './ErrorCodes';

export class FacilityError extends Error {
	private code: ErrorCodes;

	constructor(code: ErrorCodes, message?: string);
	constructor(error: IServiceError);
	constructor(codeOrError: ErrorCodes | IServiceError, message?: string) {
		let code: ErrorCodes;
		if (typeof codeOrError === 'string') {
			code = codeOrError;
		} else {
			code = (codeOrError.code as ErrorCodes) ?? ErrorCodes.InternalError;
			message = codeOrError.message;
		}
		super(`${code}: ${message}`);
		this.code = code;
	}

	public toServiceResult = (): IServiceResult<any> => ({
		error: {
			code: this.code,
			message: this.message,
		}
	});
}
