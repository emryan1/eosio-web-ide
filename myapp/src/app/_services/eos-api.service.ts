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
  public endAuction: Date;

  private url = 'https://3030-ce47a709-cc4c-4b03-815a-7e7485220d30.ws-us02.gitpod.io';

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<string>(localStorage.getItem('user'));
    this.currentUser = this.currentUserSubject.asObservable();
    this.currentUserSubjectBalance = new BehaviorSubject<string>(localStorage.getItem('balance'));
    this.currentUserBalance = this.currentUserSubjectBalance.asObservable();
    this.endAuction = new Date();
  }

  public get currentUserValue(): string {
    return this.currentUserSubject.value;
  }

  public get auctionEndDate() {
    return this.endAuction;
  }

  updateBalance() {
    const params = new HttpParams().append('username', this.currentUserValue);
    return this.http.get<any>(this.url + '/eos/get-balance', {params})
    .pipe(map(result => {
          localStorage.setItem('balance', result);
          this.currentUserSubjectBalance.next(result);
    }));
  }

  getTable(table: string){
    const params = new HttpParams().append('tableName', table);
    return this.http.get<any>(this.url + '/eos/get-table', {params});
  }

  getRecord(table: string, id: string){
    const params = new HttpParams().append('tableName', table).append('id', id);
    return this.http.get<any>(this.url + '/eos/get-record', {params});
  }

  createTicket(ticket: PARecord) {
    return this.http.post<any>(this.url + '/eos/take-action', {username: this.currentUserValue, privateKey: localStorage.getItem('private_key'), action: 'mktik', dataValue: ticket})
    .pipe(map(result => {
      //console.log("created ticket");
    }))
  }

  postListing(id: number, price: number) {
    return this.http.post<any>(this.url + '/eos/take-action', {username: this.currentUserValue, privateKey: localStorage.getItem('private_key'), action: 'postlst', dataValue: {ticket_id: id, price: price}})
  }

  buyListing(listing_id: number) {
    return this.http.post<any>(this.url + '/eos/take-action', {username: this.currentUserValue, privateKey: localStorage.getItem('private_key'), action: 'buylst', dataValue: {buyer: this.currentUserValue, listing_id: listing_id}})
    .pipe(map(result => {
      this.updateBalance().subscribe();
    }))
  }

  postAuctListing(id: number, price: number, endAuction: Date) {
    this.endAuction = new Date(endAuction);
    return this.http.post<any>(this.url + '/eos/take-action', {username: this.currentUserValue, privateKey: localStorage.getItem('private_key'), action: 'postauctlst', dataValue: {ticket_id: id, price: price}})
  }

  bidAuctionListing(bid: number, auction_id: number) {
  return this.http.post<any>(this.url + '/eos/take-action', {username: this.currentUserValue, privateKey: localStorage.getItem('private_key'), action: 'bidlst', dataValue: {bidder: this.currentUserValue, bid: bid, auction_id: auction_id}})
    .pipe(map(result => {
      this.updateBalance().subscribe();
    }))
  }

  endAuctListing(id: number) {
    return this.http.post<any>(this.url + '/eos/take-action', {username: this.currentUserValue, privateKey: localStorage.getItem('private_key'), action: 'closeauclst', dataValue: {listing_id: id}})
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
    localStorage.removeItem('balance')
    this.currentUserSubject.next(null);
    this.currentUserSubjectBalance.next(null);
  }
}
