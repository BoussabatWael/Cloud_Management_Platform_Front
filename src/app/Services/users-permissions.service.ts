import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { core_users_permissions } from '../models/core_users_permissions';

@Injectable({
  providedIn: 'root',
})
export class UsersPermissionsService {
  host = 'http://localhost:8081/api/cmp/core/users/permissions';
  //host="https://wael.local.itwise.pro/back_app/api/cmp/core/users/permissions"

  key: any;
  apikey: any;
  Token: any;
  basic: any;

  constructor(private http: HttpClient) {}

  getActiveUserPermissions(id: number): Observable<any> {
    this.key = btoa('front:PrSytImJiuOyVLb9XZsMtNJEGxTWvP');
    this.basic = { Authorization: 'Basic ' + this.key };
    return this.http.get<any>(this.host + '/usr/get/' + id, {
      headers: this.basic,
    });
  }

  getUserPermissionsByUserId(id: number): Observable<any> {
    this.apikey = localStorage.getItem('apikey');
    this.key = btoa('Authorization:' + JSON.parse(this.apikey));
    this.Token = localStorage.getItem('token');
    return this.http.get<any>(this.host + '/user/get/' + id, {
      headers: {
        Authorization: 'Basic ' + this.key,
        Token: JSON.parse(this.Token),
        'content-type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, PUT, GET, OPTIONS, DELETE',
        'Access-Control-Allow-Headers': '*',
      },
    });
  }

  updateUserPermissions(
    permission: core_users_permissions,
    id: any
  ): Observable<any> {
    this.apikey = localStorage.getItem('apikey');
    this.key = btoa('Authorization:' + JSON.parse(this.apikey));
    this.Token = localStorage.getItem('token');
    return this.http.put<any>(this.host + '/update/' + id, permission, {
      headers: {
        Authorization: 'Basic ' + this.key,
        Token: JSON.parse(this.Token),
        'content-type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, PUT, GET, OPTIONS, DELETE',
        'Access-Control-Allow-Headers': '*',
      },
    });
  }

  addUserPermissions(permission: core_users_permissions): Observable<any> {
    this.apikey = localStorage.getItem('apikey');
    this.key = btoa('Authorization:' + JSON.parse(this.apikey));
    this.Token = localStorage.getItem('token');
    return this.http.post<any>(this.host + '/create', permission, {
      headers: {
        Authorization: 'Basic ' + this.key,
        Token: JSON.parse(this.Token),
        'content-type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, PUT, GET, OPTIONS, DELETE',
        'Access-Control-Allow-Headers': '*',
      },
    });
  }
}
