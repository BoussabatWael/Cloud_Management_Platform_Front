import { core_accounts } from './core_accounts';
export class monitoring_commands {
  id!: number;
  account_id!: core_accounts;
  name!: string;
  command!: string;
  classe!: number;
  file_command!: string;
  system!: number;
  user!: string;
  event!: number;
  status!: number;
  start_date!: Date;
  end_date!: Date;
}
