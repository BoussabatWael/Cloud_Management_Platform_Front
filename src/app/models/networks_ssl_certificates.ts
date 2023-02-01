import { domain_name } from './networks_domain_names';
import { Providers } from './Providers';

export class ssl_certificates {
  id!: number;
  domain!: domain_name;
  cloud_provider_id!: number;
  name!: string;
  status!: number;
  start_date!: Date;
  end_date!: Date;
}
