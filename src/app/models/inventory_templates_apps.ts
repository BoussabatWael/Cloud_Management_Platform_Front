import { template } from './inventory_templates';

export class templates_apps {
  id!: number;
  template_id!: template;
  app!: string;
  status!: number;
  start_date!: Date;
  end_date!: Date;
}
