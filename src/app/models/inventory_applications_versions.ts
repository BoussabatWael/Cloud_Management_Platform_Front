import { inventory_applications } from './inventory_applications';

export class ApplicartionsVersions {
  id!: number;
  application_id!: inventory_applications;
  version!: String;
  status!: number;
  start_date!: Date;
  end_date!: Date;
}
