import { Injectable } from '@angular/core';
import { Api, JsonRpc } from 'eosjs';
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig'
import {BehaviorSubject,  Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EosApiService {
  private currentUserSubject: BehaviorSubject<String>;
  public currentUser: Observable<String>;
  private userKey: Number;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<String>(localStorage.getItem('user'));
    this.currentUser = this.currentUserSubject.asObservable();

  }

  public get currentUserValue(): String {
    return this.currentUserSubject.value;
  }

  login(username, privateKey) {
    //change this to http request
    return this.http.post<any>('https://3030-cb902f7e-2692-46b1-aed3-d3ebd7157b2c.ws-us02.gitpod.io/eos/take-action', {username, privateKey, action: 'login', dataValue: {user: username}})
      .pipe(map(result => {
        if (result) {
          localStorage.setItem('user', username);
          localStorage.setItem('private_key', privateKey);
          this.currentUserSubject.next(username);

        }
      }));
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('user');
    localStorage.removeItem('private_key');
    this.currentUserSubject.next(null);
  }
}
