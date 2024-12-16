import { ValidationError } from "./ValidationError";

export function validateCondition(condition: boolean, label: string): asserts condition is true {
	if (!condition) {
		throw new ValidationError(label);
	}
}
