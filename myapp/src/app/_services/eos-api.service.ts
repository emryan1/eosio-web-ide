import { Injectable } from '@angular/core';
import { Api, JsonRpc } from 'eosjs';
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig'
import {BehaviorSubject,  Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

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

  async login(username, privateKey) {
    //change this to http request
    return new Promise((resolve, reject) => {
      localStorage.setItem("user", username);
      localStorage.setItem("private_ey", privateKey);
    });
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem("user");
    localStorage.removeItem("private_key");
    this.currentUserSubject.next(null);
  }
}
