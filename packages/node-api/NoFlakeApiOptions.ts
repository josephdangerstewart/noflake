import { PoolOptions } from 'mysql2';
import { IPermissionService } from './services';

export interface NoFlakeApiOptions {
	database: PoolOptions;
	permissionService: IPermissionService;
}
