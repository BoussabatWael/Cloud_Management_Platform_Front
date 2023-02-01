import { Modules } from './Modules';
import { core_users } from './core_users';

export class core_users_modules {
  id!: number;
  user_id!: core_users;
  module_id!: Modules;
  status!: number;
  start_date!: Date;
  end_date!: Date;
}
