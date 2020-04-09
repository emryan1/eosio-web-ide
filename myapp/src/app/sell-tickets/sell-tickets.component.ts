import { Component, ViewChild, OnInit } from '@angular/core';
import { PARecord } from '../_models/PARecord';
import {MatTableDataSource} from '@angular/material/table';
import {NotificationService} from '../_services/notification.service';
import {EosApiService} from '../_services/eos-api.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-sell-tickets',
  templateUrl: './sell-tickets.component.html',
  styleUrls: ['./sell-tickets.component.css']
})
export class SellTicketsComponent implements OnInit {
  ownedTickets: PARecord[] = [];
  dataSource: MatTableDataSource<PARecord>;
  selected: PARecord;
  sellForm: FormGroup;
  loading = false;
  submitted = false;

  constructor(private notifService:NotificationService, private api:EosApiService, private formbuilder: FormBuilder) {
    this.loadTickets();
    this.dataSource = new MatTableDataSource(this.ownedTickets);

  }

  ngOnInit() {
     this.sellForm = this.formbuilder.group({
      ticket:['',Validators.required],
      price:['', [Validators.required, Validators.min(1)]]
    })
  }

  get form() {return this.sellForm.controls;}

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

  onSubmit() {
    this.submitted = true;

    //stop if the form isnt valid
    if (this.sellForm.invalid) {
      return;
    }

    this.loading = true;
    //use eos api to post listing
    this.api.postListing(this.form.ticket.value.id, this.form.price.value)
      .subscribe(data => {
        this.sellForm.reset();
        this.loading =  false;
        this.submitted = false;},
      err => {
        this.loading = false;
        this.notifService.showNotif(err)
      });
  }

}
