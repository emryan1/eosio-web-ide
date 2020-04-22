import { Component, ViewChild, OnInit } from '@angular/core';
import { PARecord } from '../_models/PARecord';
import {MatTableDataSource} from '@angular/material/table';
import {NotificationService} from '../_services/notification.service';
import {EosApiService} from '../_services/eos-api.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {ConfirmationComponent} from '../confirmation/confirmation.component';

@Component({
  selector: 'app-sell-tickets',
  templateUrl: './sell-tickets.component.html',
  styleUrls: ['./sell-tickets.component.css']
})
export class SellTicketsComponent implements OnInit {
  ownedTickets: PARecord[] = [];
  postedTickets: PARecord[] = [];
  dataSource: MatTableDataSource<PARecord>;
  displayedColumns: string[] = ["GameName", "SportSeason", "StadiumSection", "Location", "GameDate", "Section", "Row", "Seat"];
  postedDataSource: MatTableDataSource<PARecord>;
  selected: PARecord;
  sellForm: FormGroup;
  loading = false;
  submitted = false;

  constructor(private notifService:NotificationService, private api:EosApiService, private formbuilder: FormBuilder, private dialog: MatDialog) {
    this.loadTickets();
    this.dataSource = new MatTableDataSource(this.ownedTickets);

  }

  ngOnInit() {
     this.sellForm = this.formbuilder.group({
      ticket:['',Validators.required],
      price:['', [Validators.required, Validators.min(1), Validators.pattern('^[0-9]+$')]]
    })
  }

  get form() {return this.sellForm.controls;}

  openDialog(): void {
    if (this.sellForm.invalid) {
      return;
    }
    const dialogRef = this.dialog.open(ConfirmationComponent, {
      width: '250px',
      data: {for_sale: false, price: this.form.price.value}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.onSubmit();
      }
    });
  }

  private loadTickets() {
    this.ownedTickets = [];
    this.api.getTable("tickets").subscribe(
      tickets => {
        tickets.rows.forEach(element => {
          if (element.owner == this.api.currentUserValue && element.for_sale == 0 && element.for_auction == 0) {
            this.ownedTickets.push(element);
          }
          if (element.owner == this.api.currentUserValue && element.for_sale == 1 && element.for_auction == 0) {
            this.postedTickets.push(element);
          }
        });
        this.postedDataSource = new MatTableDataSource(this.postedTickets);
      },
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
        this.loadTickets();
        this.loading =  false;
        this.submitted = false;},
      err => {
        this.loading = false;
        this.notifService.showNotif(err)
      });

  }

}
