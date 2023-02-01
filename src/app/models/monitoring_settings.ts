import { core_accounts } from './core_accounts';
export class monitoring_settings {
  id!: number;
  account_id!: core_accounts;
  agent_status!: number;
  agent_interval!: number;
  agent_severity!: number;
}
