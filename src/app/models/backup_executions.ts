import { backup_operations } from './backup_operations';

export class backup_execution {
  id!: number;
  operation_id!: backup_operations;
  file!: string;
  status!: number;
  start_date!: Date;
  end_date!: Date;
}
