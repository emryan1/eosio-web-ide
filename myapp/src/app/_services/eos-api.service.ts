import { Injectable } from '@angular/core';
import { Api, JsonRpc } from 'eosjs';
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig'
import {BehaviorSubject,  Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EosApiService {
  private currentUserSubject: BehaviorSubject<String>;
  public currentUser: Observable<String>;
  private userKey: Number;

  constructor() {
    this.currentUserSubject = new BehaviorSubject<String>(localStorage.getItem('user'));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): String {
    return this.currentUserSubject.value;
  }

  async login(username, privateKey) {
    return new Promise((resolve, reject) => {
      localStorage.setItem("user", username);
      localStorage.setItem("private_ey", privateKey);
      this.takeAction("login", {username: username})
      .then(() => {
          resolve();
        })
        .catch(err => {
          localStorage.removeItem("user");
          localStorage.removeItem("private_key");
          reject(err);
        });

    });

  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem("user");
    localStorage.removeItem("private_key");
    this.currentUserSubject.next(null);
  }

  async takeAction(action, dataValue) {
    const privateKey = localStorage.getItem("private_key");
    const rpc = new JsonRpc("http://localhost:8888");
    const signatureProvider = new JsSignatureProvider([privateKey]);
    const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });

    // Main call to blockchain after setting action, account_name and data
    try {
      const resultWithConfig = await api.transact({
        actions: [{
          account: "hokietok",
          name: action,
          authorization: [{
            actor: localStorage.getItem("user"),
            permission: 'active',
          }],
          data: dataValue,
        }]
      }, {
        blocksBehind: 3,
        expireSeconds: 30,
      });
      return resultWithConfig;
    } catch (err) {
      throw(err)
    }
  }
}
