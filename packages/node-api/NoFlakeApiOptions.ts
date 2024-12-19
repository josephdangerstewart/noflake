import { IPermissionService } from './services';
import { DatabaseConnectionOptions } from './database';

export interface NoFlakeApiOptions {
	database: DatabaseConnectionOptions;
	permissionService: IPermissionService;
}
