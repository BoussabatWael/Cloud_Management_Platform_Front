import { core_accounts } from './core_accounts';

export class backup_operations {
  id!: number;
  account!: core_accounts;
  name!: string;
  classe!: number;
  run!: number;
  layout!: number;
  target!: number;
  synchronization!: number;
  schedule!: Date;
  status!: number;
  start_date!: Date;
  end_date!: Date;
}
