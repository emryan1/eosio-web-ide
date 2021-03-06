import { Component, OnInit } from '@angular/core';
import {NotificationService} from '../_services/notification.service';
import {PARecord} from '../_models/PARecord';
import {EosApiService} from '../_services/eos-api.service';

@Component({ templateUrl: 'view-tickets.component.html',
styleUrls: ['view-tickets.component.css']})
export class ViewTicketsComponent implements OnInit {

  userTickets: PARecord[] = [];


  constructor(
    private notifService: NotificationService,
    private api: EosApiService
  ) {}

  ngOnInit() {
    this.loadTickets();
  }

  private loadTickets() {
    this.userTickets = [];
    this.api.getTable("tickets").subscribe(
      tickets => {tickets.rows.forEach(element => {
        if (element.owner == this.api.currentUserValue && element.for_sale == 0 && element.for_auction == 0) {
          this.userTickets.push(element);
        }
      });;},
      err => {this.notifService.showNotif(err, 'error')}
    );
  }

}
