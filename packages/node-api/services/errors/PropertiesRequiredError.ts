import { ValidationError } from './ValidationError';

export class PropertiesRequiredError extends ValidationError {
	constructor(...propertyNames: (string | number | symbol)[]) {
		super(
			`${propertyNames.length === 1 ? 'Property' : 'Properties'} ${propertyNames.map((x) => `"${toString(x)}"`).join(', ')} ${propertyNames.length === 1 ? 'is' : 'are'} required`,
		);
	}
}

function toString(propertyName: string | number | symbol): string {
	if (typeof propertyName === 'symbol') {
		return propertyName.toString();
	}

	if (typeof propertyName === 'number') {
		return propertyName.toString();
	}

	return propertyName;
}
