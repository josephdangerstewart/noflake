import { IServiceResult } from 'facility-core';

export function verifyResponse<T>(result: IServiceResult<T>): T {
	expect(result.error).toBeUndefined();
	expect(result.value).toBeDefined();
	return result.value!;
}
