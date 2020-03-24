import { Component, OnInit } from '@angular/core';
import {UserService} from '../_services/user.service';
import { PARecord } from '../_models/PARecord';

@Component({
  selector: 'app-buy-tickets',
  templateUrl: './buy-tickets.component.html',
  styleUrls: ['./buy-tickets.component.css']
})
export class BuyTicketsComponent implements OnInit {

  tickets: PARecord[] = [];

  constructor(private userService:UserService) { }

  ngOnInit() {
    this.userService.getActivities().subscribe(
      tickets => {this.tickets = tickets}
      );
  }

}
