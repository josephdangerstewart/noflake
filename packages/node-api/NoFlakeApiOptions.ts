import { IPermissionService } from './services';
import { DatabaseConnectionOptions } from './database/getDatabase';

export interface NoFlakeApiOptions {
	database: DatabaseConnectionOptions;
	permissionService: IPermissionService;
}
