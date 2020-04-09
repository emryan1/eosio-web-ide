import { Component, AfterViewInit, ViewChild, OnInit } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import { PARecord } from '../_models/PARecord';
import {MatTableDataSource} from '@angular/material/table';
import {NotificationService} from '../_services/notification.service';
import {EosApiService} from '../_services/eos-api.service';

@Component({
  selector: 'app-buy-tickets',
  templateUrl: './buy-tickets.component.html',
  styleUrls: ['./buy-tickets.component.css']
})
export class BuyTicketsComponent implements OnInit {
  currBids: PARecord[] = [];
  auction: PARecord[] = [];
  listing: PARecord[] = [];
  //Determines which coloums are shown in the table, add or remove if necessary
  displayedColumns: string[] = ["GameName", "SportSeason", "StadiumSection", "Location", "GameDate", "Section", "Row", "Seat", "Button"];
  auctionDataSource: MatTableDataSource<PARecord>;
  listingDataSource: MatTableDataSource<PARecord>;
  isLoadingResults = false;
  loadingBuy = false;
  resultsLength = 0;
  checked: boolean = false;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(private notifService:NotificationService, private api: EosApiService) {
    this.loadTickets();
    this.auctionDataSource = new MatTableDataSource(this.auction);
    this.auctionDataSource.sort = this.sort;
    this.auctionDataSource.paginator = this.paginator;
    this.listingDataSource = new MatTableDataSource(this.listing);
    this.listingDataSource.sort = this.sort;
    this.listingDataSource.paginator = this.paginator;
  }

  ngOnInit() {}

  buyListing(id: number) {
    console.log("bought ticket:" + id);
    this.loadingBuy = true;
    let listingID: number;
    this.api.getRecord("listings", id.toString()).subscribe(x => {
      listingID = x.rows[0].id;
      console.log("listing_id:" + listingID);
      this.api.buyListing(listingID).subscribe(data =>{
        this.loadingBuy = false;
      },
      err => {
        this.loadingBuy = false;
        this.notifService.showNotif(err);
      });
      this.loadTickets();
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.auctionDataSource.filter = filterValue.trim().toLocaleLowerCase();
    this.listingDataSource.filter = filterValue.trim().toLocaleLowerCase();

    if (this.auctionDataSource.paginator) {
      this.auctionDataSource.paginator.firstPage();
    }
    if (this.listingDataSource.paginator) {
      this.listingDataSource.paginator.firstPage();
    }
  }

  clearFilters() {
    this.auctionDataSource.filter = null;
    this.listingDataSource.filter = null;
    if (this.auctionDataSource.paginator) {
      this.auctionDataSource.paginator.firstPage();
    }
    if (this.listingDataSource.paginator) {
      this.listingDataSource.paginator.firstPage();
    }
  }

  private loadTickets() {
    this.isLoadingResults = true;
    this.listing = []
    this.api.getTable("tickets").subscribe(
      tickets => {tickets.rows.forEach(element => {
        if (element.owner != this.api.currentUserValue && element.for_sale == 1) {
          this.listing.push(element);
        }
      });},
      err => {this.notifService.showNotif(err, 'error')}
    );
    this.isLoadingResults = false;
    console.log("loaded tickets")
  }


}
