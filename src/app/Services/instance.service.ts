import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InstanceService {
  host = 'http://localhost:8081/api/cmp/inventory/instances';
  //host="https://wael.local.itwise.pro/back_app/api/cmp/inventory/instances"

  key: any;
  apikey: any;
  Token: any;

  constructor(private http: HttpClient) {}

  getAllInventoryInstances(): Observable<any[]> {
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

  getInventoryInstancesByID(id: any): Observable<any> {
    this.apikey = localStorage.getItem('apikey');
    this.key = btoa('Authorization:' + JSON.parse(this.apikey));
    this.Token = localStorage.getItem('token');
    return this.http.get<any>(this.host + '/get/' + id, {
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

  getInventoryInstancesNumber(id: any): Observable<any> {
    this.apikey = localStorage.getItem('apikey');
    this.key = btoa('Authorization:' + JSON.parse(this.apikey));
    this.Token = localStorage.getItem('token');
    return this.http.get<any>(this.host + '/provider/get/' + id, {
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

  updateInventoryInstance(instance: any, id: any): Observable<any> {
    this.apikey = localStorage.getItem('apikey');
    this.key = btoa('Authorization:' + JSON.parse(this.apikey));
    this.Token = localStorage.getItem('token');
    return this.http.put<any>(this.host + '/update/' + id, instance, {
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

  saveInstance(instance: any): Observable<any> {
    this.apikey = localStorage.getItem('apikey');
    this.key = btoa('Authorization:' + JSON.parse(this.apikey));
    this.Token = localStorage.getItem('token');
    return this.http.post<any>(this.host + '/create', instance, {
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
