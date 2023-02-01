import { core_users } from './core_users';

export class logs {
  id!: number;
  user!: core_users;
  action!: String;
  element!: number;
  element_id!: number;
  log_date!: Date;
  source!: number;
}
