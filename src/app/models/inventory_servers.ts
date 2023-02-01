import { inventory_instances } from './inventory_instances';

export class inventory_servers {
  id!: number;
  classe!: number;
  external_id!: number;
  ip_address!: String;
  operating_system!: number;
  os_version!: String;
  location!: number;
  cpu!: number;
  disk_space!: number;
  memory!: number;
  environment!: number;
  instance!: inventory_instances;
}
