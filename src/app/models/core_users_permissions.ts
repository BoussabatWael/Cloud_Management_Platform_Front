import { core_users } from './core_users';

export class core_users_permissions {
  id!: number;
  user!: core_users;
  code!: String;
  dependency!: number;
  status!: number;
}
