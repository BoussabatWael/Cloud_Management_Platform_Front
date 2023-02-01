import { Modules } from './Modules';
import { core_accounts } from './core_accounts';

export class AccountModules {
  id!: number;
  account_id!: core_accounts;
  module_id!: Modules;
  status!: number;
  start_date!: Date;
  end_date!: Date;
}
