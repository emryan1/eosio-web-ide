import { Component, ViewChild, OnInit } from '@angular/core';
import {UserService} from '../_services/user.service';
import { PARecord } from '../_models/PARecord';
import {MatTableDataSource} from '@angular/material/table';
import {NotificationService} from '../_services/notification.service';

@Component({
  selector: 'app-sell-tickets',
  templateUrl: './sell-tickets.component.html',
  styleUrls: ['./sell-tickets.component.css']
})
export class SellTicketsComponent implements OnInit {
  ownedTickets: PARecord[];
  dataSource: MatTableDataSource<PARecord>;
  selected: String;

  constructor(private notifService:NotificationService) {
    this.dataSource = new MatTableDataSource(this.ownedTickets);
  }

  ngOnInit() {
  }

}
