import { inventory_applications } from './inventory_applications';

export class ApplicationsDependecies {
  id!: number;
  application_id!: inventory_applications;
  element!: number;
  element_value!: String;
  version_id!: number;
  status!: number;
  start_date!: Date;
  end_date!: Date;
}
