import { inventory_applications } from './inventory_applications';

export class ApplicationsSources {
  id!: number;
  application_id!: inventory_applications;
  classe!: number;
  source_type!: number;
  source_account!: string;
  source_url!: string;
  source_build!: string;
  status!: number;
  start_date!: Date;
  end_date!: Date;
}
