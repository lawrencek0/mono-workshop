import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from "@angular/http";

import {Observable} from "rxjs";
import 'rxjs/add/operator/map';

@Injectable()
export class ContactService {

  private headers = new Headers({ 'Content-Type': 'application/json', 'charset': 'UTF-8' });
  private options = new RequestOptions({ headers: this.headers });

  constructor(private http: Http) { }

  sendContact(contact): Observable<any> {
    return this.http.post('/api/contact', JSON.stringify(contact), this.options);
  }

}
