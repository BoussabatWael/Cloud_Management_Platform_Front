import { domain_name } from './../models/networks_domain_names';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DomaineNameService {
  host = 'http://localhost:8081/api/cmp/networks/domain/names';
  //host="https://wael.local.itwise.pro/back_app/api/cmp/networks/domain/names"

  constructor(private http: HttpClient) {}

  key: any;
  apikey: any;
  Token: any;

  getAllDomainNames(): Observable<any[]> {
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

  getDomainNamesById(id: number): Observable<any> {
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

  getSubDomainNamesList(parent_id: number): Observable<any[]> {
    this.apikey = localStorage.getItem('apikey');
    this.key = btoa('Authorization:' + JSON.parse(this.apikey));
    this.Token = localStorage.getItem('token');
    return this.http.get<any[]>(this.host + '/subdomains/get/' + parent_id, {
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

  updateDomainNames(domain_name: domain_name, id: any): Observable<any> {
    this.apikey = localStorage.getItem('apikey');
    this.key = btoa('Authorization:' + JSON.parse(this.apikey));
    this.Token = localStorage.getItem('token');
    return this.http.put<any>(this.host + '/update/' + id, domain_name, {
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

  saveDomainNames(domain_name: domain_name): Observable<any> {
    this.apikey = localStorage.getItem('apikey');
    this.key = btoa('Authorization:' + JSON.parse(this.apikey));
    this.Token = localStorage.getItem('token');
    return this.http.post<any>(this.host + '/create', domain_name, {
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
