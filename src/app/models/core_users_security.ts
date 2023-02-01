import { core_users } from './core_users';

export class core_users_security {
  id!: number;
  user!: core_users;
  login!: String;
  password!: String;
  status!: number;
  start_date!: Date;
  end_date!: Date;
}
