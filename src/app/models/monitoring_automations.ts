import { core_accounts } from './core_accounts';
export class monitoring_automations {
  id!: number;
  account_id!: core_accounts;
  name!: string;
  element!: number;
  element_id!: number;
  classe!: number;
  unit!: String;
  scale!: number;
  status!: number;
  start_date!: Date;
  end_date!: Date;
}
