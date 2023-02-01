import { inventory_servers } from './inventory_servers';
import { monitoring_commands } from './monitoring_commands';

export class commands_executions {
  id!: number;
  command_id!: monitoring_commands;
  server_id!: inventory_servers;
  status!: number;
  start_date!: Date;
  end_date!: Date;
}
