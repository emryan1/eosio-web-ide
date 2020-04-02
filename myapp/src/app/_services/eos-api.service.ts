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
    //console.log
  }

  public get currentUserValue(): String {
    return this.currentUserSubject.value;
  }

  login(username, privateKey) {
    //change this to http request
    return this.http.post<any>('https://3030-b0592fe3-c866-469b-bf75-f901290a5a20.ws-us02.gitpod.io/eos/test', {username, privateKey, action: 'login', dataValue: ""})
      .pipe(map(result => {
        if (result) {
          localStorage.setItem('user', username);
          localStorage.setItem('private_key', privateKey);
          this.currentUserSubject.next("user");
        }
      }));
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem("user");
    localStorage.removeItem("private_key");
    this.currentUserSubject.next(null);
  }
}
