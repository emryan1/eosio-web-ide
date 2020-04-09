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
  displayedColumns: string[] = ["GameName", "SportSeason", "StadiumSection", "Location", "GameDate", "Section", "Row", "Seat", "Price", "Button"];
  auctionDataSource: MatTableDataSource<PARecord>;
  listingDataSource: MatTableDataSource<PARecord>;
  isLoadingResults = false;
  loadingBuy = false;
  resultsLength = 0;
  checked: boolean = false;
  userBalance: number;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(private notifService:NotificationService, private api: EosApiService) {
    this.loadTicketsBetter();
    this.api.currentUserBalance.subscribe(balance => this.userBalance = parseInt(balance));
  }

  ngOnInit() {}

  buyListing(ticket_id: number) {
    console.log("bought ticket:" + ticket_id);
    this.loadingBuy = true;
    let listingID: number;
    let price: number;
    this.api.getTable("listings").subscribe(table => {
      table.rows.forEach(ticket => {
        if (ticket.ticket_id == ticket_id) {
          price = ticket.price;
          listingID = ticket.id;
        }
        });
      if (this.userBalance - price < 0) {
        this.notifService.showNotif("You Do Not Have Enough Hokie Tokens", "OK")
      }
      else {
          console.log("listing_id:" + listingID);
          this.api.buyListing(listingID).subscribe(data =>{
            this.loadTicketsBetter();
            this.loadingBuy = false;
          },
          err => {
            this.loadingBuy = false;
            this.notifService.showNotif(err);
          });
      }
    },
    err => {
      this.notifService.showNotif(err);
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

  onCheckChange(event: Event) {
    //Here we need to pull the auction table, check which tickets you bid on, and change auctionDataSource to just those tickets
  }

  bid(ticket_id: number){
    //bid on ticket
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

  getPrice(ticket_id: number): number{
    let price: number;
    this.api.getTable("listings").subscribe(table => {
      table.rows.forEach(ticket => {
        if (ticket.ticket_id == ticket_id) {
          price = ticket.price;
          console.log(price);
        }
      })
    },
    err => {
        this.loadingBuy = false;
        this.notifService.showNotif(err);
    });
    return price;
  }

  //doesnt load the price, keeping this method incase I need to reference it
  private loadTickets() {
    this.isLoadingResults = true;
    this.listing = [];
    this.auction = [];
    this.api.getTable("tickets").subscribe(
      tickets => {tickets.rows.forEach(element => {
        if (element.owner != this.api.currentUserValue && element.for_sale == 1) {
          this.listing.push(element);
        }
        if (element.owner != this.api.currentUserValue && element.for_auction == 1) {
          this.auction.push(element);
        }
      });
        this.auctionDataSource = new MatTableDataSource(this.auction);
        this.auctionDataSource.sort = this.sort;
        this.auctionDataSource.paginator = this.paginator;
        this.listingDataSource = new MatTableDataSource(this.listing);
        this.listingDataSource.sort = this.sort;
        this.listingDataSource.paginator = this.paginator;
      },
      err => {this.notifService.showNotif(err, 'error')}
    );
    this.isLoadingResults = false;
    console.log("loaded tickets")
  }

    //Fully loads tickets with prices, use this one
    private loadTicketsBetter() {
    this.isLoadingResults = true;
    this.listing = [];
    this.auction = [];
    this.api.getTable("tickets").subscribe(
      tickets => {
      this.api.getTable("listings").subscribe(listings => {
        tickets.rows.forEach(tix => {
          listings.rows.forEach(list => {
            if (list.ticket_id == tix.id) {
              tix.price = list.price;
              if (tix.owner != this.api.currentUserValue && tix.for_sale == 1) {
                this.listing.push(tix);
              }
              if (tix.owner != this.api.currentUserValue && tix.for_auction == 1) {
                this.auction.push(tix);
              }
            }
          });});
        this.auctionDataSource = new MatTableDataSource(this.auction);
        this.auctionDataSource.sort = this.sort;
        this.auctionDataSource.paginator = this.paginator;
        this.listingDataSource = new MatTableDataSource(this.listing);
        this.listingDataSource.sort = this.sort;
        this.listingDataSource.paginator = this.paginator;
    },
    err => {
        this.notifService.showNotif(err);
    });
      },
      err => {this.notifService.showNotif(err, 'error')}
    );
    this.isLoadingResults = false;
    console.log("loaded tickets")
  }
}
