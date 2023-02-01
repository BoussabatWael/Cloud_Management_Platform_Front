import { inventory_applications } from './inventory_applications';
import { inventory_instances } from './inventory_instances';

export class ApplicationsInsatances {
  id!: number;
  application_id!: inventory_applications;
  instance_id!: inventory_instances;
  status!: number;
  start_date!: Date;
  end_date!: Date;
}
