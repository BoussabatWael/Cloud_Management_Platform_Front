import { inventory_instances } from './inventory_instances';
import { ProvidersAccounts } from './cloud_providers_accounts';
import { inventory_hosts } from './inventory_hosts';
import { inventory_servers } from './inventory_servers';
import { domain_name } from './networks_domain_names';
import { Providers } from './Providers';

export class network_hosts {
  id!: number;
  domain!: domain_name;
  cloud_provider_acount!: ProvidersAccounts;
  instance!: inventory_instances;
  hosting!: inventory_hosts;
  parent_id!: number;
  status!: number;
  start_date!: Date;
  end_date!: Date;
}
