import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ssl_certificates } from '../models/networks_ssl_certificates';

@Injectable({
  providedIn: 'root',
})
export class NetworkSslCertificatesService {
  host = 'http://localhost:8081/api/cmp/networks/sslcertificates';
  //host="https://wael.local.itwise.pro/back_app/api/cmp/networks/sslcertificates"

  key: any;
  apikey: any;
  Token: any;

  constructor(private http: HttpClient) {}

  getDomainSSLCertificatesList(id: number): Observable<any[]> {
    this.apikey = localStorage.getItem('apikey');
    this.key = btoa('Authorization:' + JSON.parse(this.apikey));
    this.Token = localStorage.getItem('token');
    return this.http.get<any[]>(this.host + '/domain/get/' + id, {
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

  getSSLCertificatesByID(id: number): Observable<any> {
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

  updateSSLCertificates(
    sslCertificate: ssl_certificates,
    id: any
  ): Observable<any> {
    this.apikey = localStorage.getItem('apikey');
    this.key = btoa('Authorization:' + JSON.parse(this.apikey));
    this.Token = localStorage.getItem('token');
    return this.http.put<any>(this.host + '/update/' + id, sslCertificate, {
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

  saveSSLCertificates(sslCertificate: ssl_certificates): Observable<any> {
    this.apikey = localStorage.getItem('apikey');
    this.key = btoa('Authorization:' + JSON.parse(this.apikey));
    this.Token = localStorage.getItem('token');
    return this.http.post<any>(this.host + '/create', sslCertificate, {
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
