import { ParsingError } from "../../errors/src/ParsingError";

export function stringifyId(id: bigint): string {
	return id.toString();
}

export function parseId(idString: string): bigint {
	try {
		return BigInt(idString);
	} catch {
		throw new ParsingError(idString, 'id');
	}
}

export function parseDate(dateString: string): Date;
export function parseDate(dateString: string | undefined): Date | undefined;
export function parseDate(dateString?: string): Date | undefined {
	if (!dateString) {
		return  undefined;
	}

	const date = new Date(dateString);

	if (isNaN(date.getTime())) {
		throw new ParsingError(dateString, 'date');
	}

	return date;
}
