import { ValidationError } from './ValidationError';

export class ObjectNullishError extends ValidationError {
	constructor() {
		super('Object is null');
	}
}
