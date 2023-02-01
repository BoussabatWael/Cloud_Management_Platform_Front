import { core_accounts } from './core_accounts';

export class core_users {
  id!: number;
  account!: core_accounts;
  firstname!: String;
  email!: String;
  lastname!: String;
  role!: number;
  language!: String;
  timezone!: String;
  browser!: String;
  ip_address!: String;
  last_auth!: Date;
  photo!: String;
  has_token!: number;
  status!: number;
}
