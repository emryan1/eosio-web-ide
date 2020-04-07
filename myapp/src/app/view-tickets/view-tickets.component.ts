import { Component, OnInit } from '@angular/core';
import {NotificationService} from '../_services/notification.service';
import {PARecord} from '../_models/PARecord';
import {UserService} from '../_services/user.service';
import {EosApiService} from '../_services/eos-api.service';

@Component({ templateUrl: 'view-tickets.component.html',
styleUrls: ['view-tickets.component.css']})
export class ViewTicketsComponent implements OnInit {

  myTickets: PARecord[] = [];


  constructor(
    private userService: UserService,
    private notifService: NotificationService,
    private api: EosApiService
  ) {}

  ngOnInit() {
    this.loadTickets();
  }

  private loadTickets() {
    this.api.getTable("tickets").subscribe(
      tickets => {this.myTickets = tickets.rows;},
      err => {this.notifService.showNotif(err, 'error')}
    );
  }

}
