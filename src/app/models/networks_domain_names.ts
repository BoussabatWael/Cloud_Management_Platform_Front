import { ProvidersAccounts } from './cloud_providers_accounts';
import { core_accounts } from './core_accounts';
import { Providers } from './Providers';

export class domain_name {
  id!: number;
  account!: core_accounts;
  cloud_provider_acount!: ProvidersAccounts;
  name!: string;
  status!: number;
  renew_date!: String | null;
  start_date!: Date;
  end_date!: Date;
  parent_id!: number;
}
