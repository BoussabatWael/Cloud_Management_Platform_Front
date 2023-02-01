import { core_accounts } from './core_accounts';
export class monitoring_policies {
  id!: number;
  account_id!: core_accounts;
  name!: string;
  metric!: number;
  condition!: number;
  threshold!: string;
  duration!: string;
  status!: number;
  start_date!: Date;
  end_date!: Date;
}
