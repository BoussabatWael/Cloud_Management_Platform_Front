import { core_accounts } from './core_accounts';

export class template {
  id!: number;
  account_id!: core_accounts;
  name!: string;
  instance_type!: number;
  status!: number;
  start_date!: Date;
  end_date!: Date;
}
