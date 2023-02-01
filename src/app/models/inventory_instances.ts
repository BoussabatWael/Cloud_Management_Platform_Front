import { template } from './inventory_templates';
import { core_accounts } from './core_accounts';
import { Providers } from './Providers';
import { ProvidersAccounts } from './cloud_providers_accounts';

export class inventory_instances {
  id!: number;
  account!: core_accounts;
  cloud_provider_acount!: ProvidersAccounts;
  template!: template | undefined;
  name!: String;
  creationType!: number;
  favorite!: number;
  status!: number;
  start_date!: Date;
  end_date!: Date;
}
