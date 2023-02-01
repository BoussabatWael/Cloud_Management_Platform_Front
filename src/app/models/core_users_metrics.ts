import { Metrics } from './Metrics';
import { core_users } from './core_users';

export class core_users_metrics {
  id!: number;
  user_id!: core_users;
  metric_id!: Metrics;
  status!: number;
  start_date!: Date;
  end_date!: Date;
}
