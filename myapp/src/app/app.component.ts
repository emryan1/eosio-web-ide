import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {NotificationService} from './_services/notification.service';
import { EosApiService } from './_services/eos-api.service';
import { ThemePalette } from '@angular/material';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'myapp';
  balance: string;
  currentUser: string;
  homeColor = '';
  buyColor = '';
  sellColor = '';
  viewColor = '';
  adminColor = '';

  constructor(private router:Router, private notif:NotificationService, private api:EosApiService) {
    //Here we will need to use the eos api that we create to get information about the user
    this.api.currentUserBalance.subscribe(balance => {this.balance = balance});
    this.api.currentUser.subscribe(user => this.currentUser = user);
  }

  logout() {
    //need to call a logout function from a service we build either from eos or otherwise
    this.api.logout();
    this.router.navigate(['/login']);
    this.homeColor = '';
    this.buyColor = '';
    this.sellColor = '';
    this.viewColor = '';
    this.adminColor = '';
  }

  update() {
    this.api.updateBalance().subscribe();
    this.homeColor = '';
    this.buyColor = '';
    this.sellColor = '';
    this.viewColor = '';
    this.adminColor = '';
  }

  get getUser() {
    return this.currentUser;
  }

  get isAdmin() {
    return this.currentUser == 'hokietokacc';
  }

  get getBalance() {
    return this.balance;
  }

}
