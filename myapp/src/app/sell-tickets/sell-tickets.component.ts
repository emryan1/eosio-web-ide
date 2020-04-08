import { Component, ViewChild, OnInit } from '@angular/core';
import {UserService} from '../_services/user.service';
import { PARecord } from '../_models/PARecord';
import {MatTableDataSource} from '@angular/material/table';
import {NotificationService} from '../_services/notification.service';
import {EosApiService} from '../_services/eos-api.service';

@Component({
  selector: 'app-sell-tickets',
  templateUrl: './sell-tickets.component.html',
  styleUrls: ['./sell-tickets.component.css']
})
export class SellTicketsComponent implements OnInit {
  ownedTickets: PARecord[] = [];
  dataSource: MatTableDataSource<PARecord>;
  selected: PARecord;

  constructor(private notifService:NotificationService, private api:EosApiService) {
    this.loadTickets();
    this.dataSource = new MatTableDataSource(this.ownedTickets);
  }

  ngOnInit() {
  }

    private loadTickets() {
    this.api.getTable("tickets").subscribe(
      tickets => {tickets.rows.forEach(element => {
        if (element.owner == this.api.currentUserValue) {
          this.ownedTickets.push(element);
        }
      });;},
      err => {this.notifService.showNotif(err, 'error')}
    );
  }

}
