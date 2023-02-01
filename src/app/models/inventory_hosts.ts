import { ProvidersAccounts } from './cloud_providers_accounts';
import { core_accounts } from './core_accounts';

export class inventory_hosts {
  id!: number;
  account!: core_accounts;
  cloud_provider_acount!: ProvidersAccounts;
  name!: string;
  status!: number;
  start_date!: Date;
  end_date!: Date;
}
