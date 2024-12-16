import { DatabaseError } from './DatabaseError';

export class DatabaseInsertError extends DatabaseError {
	constructor(tableName: string) {
		super(`Could not insert into ${tableName}`);
	}
}
