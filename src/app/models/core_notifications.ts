import { core_accounts } from './core_accounts';

export class core_notifications {
  id!: number;
  account_id!: core_accounts;
  name!: string;
  device!: number;
  classe!: number;
  language!: string;
  content!: string;
  status!: number;
}
