export const errorCodes: { [code: string]: number } = {
	'NotModified': 304,
	'InvalidRequest': 400,
	'NotAuthenticated': 401,
	'NotAuthorized': 403,
	'NotFound': 404,
	'Conflict': 409,
	'RequestTooLarge': 413,
	'TooManyRequests': 429,
	'InternalError': 500,
	'ServiceUnavailable': 503,
};

export function getErrorCode(code?: string): number {
	if (!code) {
		return 500;
	}

	return errorCodes[code] ?? 500;
}
