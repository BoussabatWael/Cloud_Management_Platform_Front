import { inventory_servers } from './inventory_servers';
import { monitoring_policies } from './monitoring_policies';
export class monitoring_policies_servers {
  id!: number;
  policy_id!: monitoring_policies;
  server_id!: inventory_servers;
  status!: number;
  start_date!: Date;
  end_date!: Date;
}
