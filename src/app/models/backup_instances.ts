import { backup_execution } from './backup_executions';
import { inventory_instances } from './inventory_instances';

export class backup_instances {
  id!: number;
  backup_id!: backup_execution;
  instance_id!: inventory_instances;
  status!: number;
  start_date!: Date;
  end_date!: Date;
}
