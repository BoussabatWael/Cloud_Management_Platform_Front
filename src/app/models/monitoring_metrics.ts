import { core_accounts } from './core_accounts';
import { Metrics } from './Metrics';
export class monitoring_metrics {
  id!: number;
  account_id!: core_accounts;
  metric_id!: Metrics;
  status!: number;
  start_date!: Date;
  end_date!: Date;
}
