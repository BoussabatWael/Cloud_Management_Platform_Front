import { core_users_tokens } from './../models/core_users_tokens';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsersTokensService {
  host = 'http://localhost:8081/api/cmp/core/users/tokens';
  //host="https://wael.local.itwise.pro/back_app/api/cmp/core/users/tokens"

  key: any;
  basic: any;
  Token: any;

  constructor(private http: HttpClient) {}

  getUserTokenByUserID(user_id: number): Observable<any> {
    this.key = btoa('front:PrSytImJiuOyVLb9XZsMtNJEGxTWvP');
    this.basic = { Authorization: 'Basic ' + this.key };
    return this.http.get<any>(this.host + '/user/get/' + user_id, {
      headers: this.basic,
    });
  }

  addUserToken(user_token: core_users_tokens): Observable<any> {
    this.key = btoa('front:PrSytImJiuOyVLb9XZsMtNJEGxTWvP');
    this.basic = { Authorization: 'Basic ' + this.key };
    return this.http.post<any>(this.host + '/create', user_token, {
      headers: this.basic,
    });
  }
}
