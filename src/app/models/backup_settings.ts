import { core_accounts } from './core_accounts';
export class backup_settings {
  id!: number;
  account_id!: core_accounts;
  scheduled_backups!: number;
  default_backup_schedule!: number;
  backup_retention_count!: number;
  backup_storage!: number;
}
