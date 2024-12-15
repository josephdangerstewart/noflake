import { IServiceResult } from 'facility-core';
import { FacilityError } from './FacilityError';

type FacilityCallback<TArgs extends any[], TResult> = (
	...args: TArgs
) => Promise<IServiceResult<TResult>>;

export function catchFacilityErrors<TArgs extends any[], TResult>(
	callback: FacilityCallback<TArgs, TResult>,
	context: ClassMethodDecoratorContext
): FacilityCallback<TArgs, TResult> {
	async function wrapped(this: any, ...args: TArgs) {
		try {
			return await callback.call(this, ...args);
		} catch (error) {
			if (error instanceof FacilityError) {
				return error.toServiceResult();
			}
			throw error;
		}
	}

	context.addInitializer(function(this: any) {
		this[context.name] = this[context.name].bind(this);
	});

	return wrapped;
}
