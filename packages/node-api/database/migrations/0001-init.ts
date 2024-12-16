import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
	await db.schema
		.createTable('projects')
		.ifNotExists()

		.addColumn('id', 'bigint', (col) => col.primaryKey().autoIncrement())
		.addColumn('name', 'varchar(500)', (col) => col.notNull())

		.execute();

	await db.schema
		.createTable('testSuiteResults')
		.ifNotExists()

		.addColumn('id', 'bigint', (col) => col.primaryKey().autoIncrement())
		.addColumn('projectId', 'bigint', (col) => col.notNull())
		.addColumn('commitSha', 'varchar(40)')
		.addColumn('runDate', 'datetime', (col) => col.notNull())

		.addForeignKeyConstraint('projectIdForeign', ['projectId'], 'projects', [
			'id',
		])

		.execute();

	await db.schema
		.createTable('testResults')
		.ifNotExists()

		.addColumn('id', 'bigint', (col) => col.primaryKey().autoIncrement())
		.addColumn('externalId', 'varchar(500)', (col) => col.notNull())
		.addColumn('suiteResultId', 'bigint', (col) => col.notNull())
		.addColumn('status', 'integer', (col) => col.notNull())
		.addColumn('errors', 'json')
		.addColumn('flakeConfidence', 'decimal')

		.addForeignKeyConstraint(
			'suiteRunIdForeign',
			['suiteResultId'],
			'testSuiteResults',
			['id'],
		)
		.addUniqueConstraint('externalIdSuiteResultId', ['externalId', 'suiteResultId'])

		.execute();

	await db.schema
		.createIndex('testResultsExternalId')
		.on('testResults')
		.columns(['externalId'])
		.execute();

	await db.schema
		.createIndex('testSuiteResultsRunDate')
		.on('testSuiteResults')
		.columns(['runDate'])
		.execute();
}

export async function down(): Promise<void> {
	throw new Error('downgrading db not supported');
}
