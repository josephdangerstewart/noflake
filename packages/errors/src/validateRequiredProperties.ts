import { ObjectNullishError } from './ObjectNullishError';
import { PropertiesRequiredError } from './PropertiesRequiredError';

export function validateRequiredProperties<TObj, TKeys extends (keyof TObj)[]>(
	obj: TObj | null,
	...keys: TKeys
): asserts obj is Omit<TObj, TKeys[number]> &
	Required<Pick<TObj, TKeys[number]>> {
	if (!obj) {
		throw new ObjectNullishError();
	}

	const missingProperties: (keyof TObj)[] = [];
	for (const key of keys) {
		if (obj[key] === undefined || obj[key] === null) {
			missingProperties.push(key);
		}
	}

	if (missingProperties.length) {
		throw  new PropertiesRequiredError(...missingProperties);
	}
}
