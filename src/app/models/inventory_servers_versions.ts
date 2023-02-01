import { inventory_servers } from './inventory_servers';

export class inventory_servers_versions {
  id!: number;
  server!: inventory_servers;
  name!: string;
  element!: number;
  elementId!: number;
  elementValue!: String;
  status!: number;
  start_date!: Date;
  end_date!: Date;
}
