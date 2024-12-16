import { ValidationError } from './ValidationError';

export class ParsingError extends ValidationError {
	constructor(badValue: string, expectedFormat: string) {
		super(`cold not parse ${badValue} as ${expectedFormat}`);
	}
}
