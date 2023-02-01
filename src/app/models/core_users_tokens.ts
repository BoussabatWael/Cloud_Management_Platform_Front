import { core_users } from './core_users';

export class core_users_tokens {
  id!: number;
  user!: core_users;
  token!: String;
  status!: number;
  start_date!: Date;
  end_date!: Date;
}
