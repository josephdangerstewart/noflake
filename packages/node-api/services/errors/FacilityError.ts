import { IServiceResult } from 'facility-core';
import { ErrorCodes } from './ErrorCodes';

export class FacilityError extends Error {
	private code: ErrorCodes;

	constructor(code: ErrorCodes, message?: string) {
		super(`facility error ${code}: ${message}`);
		this.code = code;
	}

	public toServiceResult = (): IServiceResult<any> => ({
		error: {
			code: this.code,
			message: this.message,
		}
	});
}
