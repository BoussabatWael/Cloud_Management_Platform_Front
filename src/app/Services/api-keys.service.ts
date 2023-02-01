import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiKeysService {
  host = 'http://localhost:8081/api/cmp/apikeys';
  //host="https://wael.local.itwise.pro/back_app/api/cmp/apikeys"

  key: any;
  basic: any;
  Token: any;

  constructor(private http: HttpClient) {}

  getOneApiKey(account_id: number): Observable<any> {
    this.key = btoa('front:PrSytImJiuOyVLb9XZsMtNJEGxTWvP');
    this.basic = { Authorization: 'Basic ' + this.key };
    //this.Token ={"Token":"JlFRX9GuPYrDHgkMG7Cyy0nqlUd3wY"};
    return this.http.get<any>(this.host + '/account/get/' + account_id, {
      headers: this.basic,
    });
  }
}
