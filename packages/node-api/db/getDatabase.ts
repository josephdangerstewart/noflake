import { DeduplicateJoinsPlugin, Kysely, MysqlDialect } from 'kysely';
import { NoFlakeDatabase } from './databaseTypes';
import { PoolOptions, createPool } from 'mysql2';

let database: Kysely<NoFlakeDatabase> | undefined;

export function getDatabase(poolOptions: PoolOptions) {
	if (!database) {
		database = new Kysely<NoFlakeDatabase>({
			dialect: new MysqlDialect({
				pool: createPool(poolOptions),
			}),
			plugins: [new DeduplicateJoinsPlugin()],
		});

		return database;
	}

	return database;
}
