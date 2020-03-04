import { Component, OnInit } from '@angular/core';
import {NotificationService} from '../_services/notification.service';
import {PARecord} from '../_models/PARecord';
import {UserService} from '../_services/user.service';

@Component({ templateUrl: 'view-tickets.component.html',
styleUrls: ['view-tickets.component.css']})
export class ViewTicketsComponent implements OnInit {

  parecords: PARecord[] = [];


  constructor(
    private userService: UserService,
    private notifService: NotificationService
  ) {}

  ngOnInit() {
    this.loadAllActivities();
  }





  private loadAllActivities() {
    this.userService.getActivities().subscribe(
      parecords => {this.parecords = parecords;

      },
      error => {this.notifService.showNotif(error, 'error'); });
  }

}
