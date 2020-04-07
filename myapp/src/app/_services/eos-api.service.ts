import { Injectable } from '@angular/core';
import { Api, JsonRpc } from 'eosjs';
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig'
import {BehaviorSubject,  Observable} from 'rxjs';
import {HttpClient, HttpParams} from '@angular/common/http';
import { map } from 'rxjs/operators';
import {PARecord} from '../_models/PARecord';

@Injectable({
  providedIn: 'root'
})
export class EosApiService {
  private currentUserSubject: BehaviorSubject<string>;
  public currentUser: Observable<string>;
  private currentUserSubjectBalance: BehaviorSubject<string>;
  public currentUserBalance: Observable<string>;
  private userKey: Number;
  private url = 'https://3030-a2e1e0fa-4832-47b5-8734-0f664a641899.ws-us02.gitpod.io';

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<string>(localStorage.getItem('user'));
    this.currentUser = this.currentUserSubject.asObservable();
    this.currentUserSubjectBalance = new BehaviorSubject<string>(localStorage.getItem('balance'));
    this.currentUserBalance = this.currentUserSubjectBalance.asObservable();

  }

  public get currentUserValue(): string {
    return this.currentUserSubject.value;
  }

  updateBalance() {
    const params = new HttpParams().append('username', this.currentUserValue);
    return this.http.get<any>(this.url + '/eos/get-balance', {params})
    .pipe(map(result => {
          console.log(result);
          console.log("updated balance");
          localStorage.setItem('balance', result);
          this.currentUserSubjectBalance.next(result);
    }));
  }

  getTable(table: string){
    const params = new HttpParams().append('tableName', table);
    return this.http.get<any>(this.url + '/eos/get-table', {params});
  }

  createTicket(ticket: PARecord) {
    return this.http.post<any>(this.url + '/eos/take-action', {username: this.currentUserValue, privateKey: localStorage.getItem('private_key'), action: 'mktik', dataValue: ticket})
    .pipe(map(result => {
      //console.log("created ticket");
    }))
  }

  transferTicket(id: number, to: string) {
    return this.http.post<any>(this.url + '/eos/take-action', {username: this.currentUserValue, privateKey: localStorage.getItem('private_key'), action: 'mvtik', dataValue: {id: id, to: to}})
  }

  login(username, privateKey) {
    //change this to http request
    return this.http.post<any>(this.url + '/eos/take-action', {username, privateKey, action: 'login', dataValue: {user: username}})
      .pipe(map(result => {
        if (result) {
          localStorage.setItem('user', username);
          localStorage.setItem('private_key', privateKey);
          this.currentUserSubject.next(username);
          this.updateBalance().subscribe();
        }
      }));
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('user');
    localStorage.removeItem('private_key');
    this.currentUserSubject.next(null);
    this.currentUserSubjectBalance.next(null);
  }
}
