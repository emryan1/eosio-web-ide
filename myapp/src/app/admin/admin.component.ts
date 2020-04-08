import { Component, OnInit} from '@angular/core';
import {PARecord} from '../_models/PARecord'
import {FormControl} from '@angular/forms';
import { EosApiService } from '../_services/eos-api.service';
import {NotificationService} from '../_services/notification.service'


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  ticket: PARecord;
  numTix = 1;
  price = 1;
  date = new FormControl(new Date())

  constructor(private api:EosApiService, private notif:NotificationService) { }

  ngOnInit() {
    this.ticket = new PARecord();
    this.ticket.game = "Football: VT vs. Miami";
    this.ticket.stadium_section = "NORTH END ZONE";
    this.ticket.season = "Football 2019";
    this.ticket.location = "Lane Statium Worsham";
    this.ticket.section = 15;
    this.ticket.row = 22;
    this.ticket.seat = 18;
  }

  temp(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
  }

  setGame(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.ticket.game = value;
  }

  setStadiumSection(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.ticket.stadium_section = value;
  }

  setSeason(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.ticket.season = value;
  }

  setLocation(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.ticket.location = value;
  }

  setDate(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.ticket.date = new Date(value);
  }

  setSection(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.ticket.section = parseInt(value);
  }

  setRow(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.ticket.row = parseInt(value);
  }

  setSeat(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.ticket.seat = parseInt(value);
  }

  setNumber(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.numTix = parseInt(value);
  }

  setPrice(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.price = parseInt(value);
  }

  submitSingle() {
    this.notif.showNotif("Submitting", 'ok');
    this.ticket.date = this.date.value;
    this.api.createTicket(this.ticket).subscribe( () => {this.notif.showNotif("Submitted", 'ok');},
      () => {
        this.notif.showNotif("Error submitting", 'ok');
    });
  }

  submitMultiple() {
    this.notif.showNotif("Submitting", 'ok');
    this.ticket.date = this.date.value;
    let i = 0;
    for(i = 0; i < this.numTix; i++) {
      this.ticket.seat = i + 1;
      this.api.createTicket(this.ticket)
        .subscribe(data => {
          this.notif.showNotif("Data " + data, 'ok');
        },
        () => {
          this.notif.showNotif("Error submitting", 'ok');
      });
    }
  }

  postAllTickets() {
    const price = this.price;
    this.api.getTable("tickets").subscribe(
      tickets => {tickets.rows.forEach(element => {
        this.api.postListing(element.id, price).subscribe(data =>
          {this.notif.showNotif('Posted ticket ' + element.id, 'ok');}
        ,
          err => {this.notif.showNotif("Could not post tickets", 'error');})
      });;},
      err => {this.notif.showNotif("Could not get tickets", 'error')}
    );
  }
}
