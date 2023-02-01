import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Modules } from '../models/Modules';

@Injectable({
  providedIn: 'root',
})
export class CoreModulesService {
  host = 'http://localhost:8081/api/cmp/core/modules';
  //host="https://wael.local.itwise.pro/back_app/api/cmp/core/modules"

  key: any;
  apikey: any;
  Token: any;

  constructor(private http: HttpClient) {}

  getAllModules(): Observable<any[]> {
    this.apikey = localStorage.getItem('apikey');
    this.key = btoa('Authorization:' + JSON.parse(this.apikey));
    this.Token = localStorage.getItem('token');
    return this.http.get<any[]>(this.host, {
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

  updateModule(module: Modules, id: any): Observable<any> {
    this.apikey = localStorage.getItem('apikey');
    this.key = btoa('Authorization:' + JSON.parse(this.apikey));
    this.Token = localStorage.getItem('token');
    return this.http.put<any>(this.host + '/update/' + id, module, {
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
