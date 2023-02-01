import { core_accounts } from './core_accounts';

export class core_access_credentials {
  id!: number;
  account_id!: core_accounts;
  name!: string;
  element!: number;
  element_id!: number;
  classe!: number;
  url!: string;
  port!: string;
  login!: string;
  password!: string;
  status!: number;
  start_date!: Date;
  end_date!: Date;
  server_id!: number;
}
