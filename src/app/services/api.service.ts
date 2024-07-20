import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private httpClient: HttpClient) { }

  public urlBase = 'https://newtecnoshop.com';
  public url = this.urlBase + '/api';

  getPosts(Type?: string, ObjectData?: any, Action?: string) {
    let Params = new HttpParams();

    let header = new HttpHeaders({ 'Content-Type': 'application/json' });

    var options = { headers: header, params: Params, body: JSON.stringify(ObjectData) };
    var urlpost = this.url;
    Action != undefined ? urlpost += '/' + Action : urlpost = this.url;
    if (Type == 'post') {
      return this.httpClient.post(urlpost, JSON.stringify(ObjectData), options);
    }
    else {
      return this.httpClient.get(this.url + Action, options);
    }
  }
}
