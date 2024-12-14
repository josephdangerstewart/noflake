import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
	await db.schema
		.createTable('projects')
		.ifNotExists()
		.addColumn('id', 'bigint', (col) => col.primaryKey().autoIncrement())
		.addColumn('name', 'varchar(255)', (col) => col.notNull())
		.execute();

	await db.schema
		.createTable('testSuiteRuns')
		.ifNotExists()
		.addColumn('id', 'bigint', (col) => col.primaryKey().autoIncrement())
		.addColumn('projectId', 'bigint', (col) => col.notNull())
		.addColumn('commitSha', 'varchar(40)')
		.addForeignKeyConstraint('projectIdForeign', ['projectId'], 'projects', [
			'id',
		])
		.execute();

	await db.schema
		.createTable('testRuns')
		.ifNotExists()
		.addColumn('id', 'bigint', (col) => col.primaryKey().autoIncrement())
		.addColumn('externalId', 'varchar(255)', (col) => col.unique().notNull())
		.addColumn('suiteRunId', 'bigint', (col) => col.notNull())
		.addColumn('status', 'integer', (col) => col.notNull())
		.addColumn('errors', 'json')
		.addColumn('flakeConfidence', 'decimal')
		.addForeignKeyConstraint(
			'suiteRunIdForeign',
			['suiteRunId'],
			'testSuiteRuns',
			['id'],
		)
		.execute();
}

export async function down(): Promise<void> {
	throw new Error('downgrading db not supported');
}
