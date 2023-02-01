import { core_accounts } from './core_accounts';
import { Providers } from './Providers';

export class ProvidersAccounts {
  id!: number;
  account_id!: core_accounts;
  provider_id!: Providers;
  credential_id!: number;
  status!: number;
  start_date!: Date;
  end_date!: Date;
}
