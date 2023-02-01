import { core_accounts } from './core_accounts';

export class inventory_applications {
  id!: number;
  account!: core_accounts;
  name!: String;
  classe!: number;
  logo!: String;
  environment!: number;
  status!: number;
  start_date!: String;
  end_date!: Date;
}
