import { Component, AfterViewInit, ViewChild, OnInit } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import { PARecord } from '../_models/PARecord';
import {MatTableDataSource} from '@angular/material/table';
import {NotificationService} from '../_services/notification.service';
import {EosApiService} from '../_services/eos-api.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {BidComponent} from '../bid/bid.component';
import { NgCircleProgressModule } from 'ng-circle-progress-day-countdown';
import { Location } from "@angular/common";
import {ConfirmationComponent} from '../confirmation/confirmation.component';

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
  displayedAuctionColumns: string[] = ["GameName", "SportSeason", "StadiumSection", "Location", "GameDate", "Section", "Row", "Seat", "Price", "HighestBidder", "Button"];
  auctionDataSource: MatTableDataSource<PARecord>;
  listingDataSource: MatTableDataSource<PARecord>;
  isLoadingResults = false;
  loadingBuy = false;
  loadingBid = false;
  resultsLength = 0;
  checked: boolean = false;
  userBalance: number;
  spinnerColor = 'orange';
  auctionMessage: string = '';

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(private notifService:NotificationService, private api: EosApiService, private dialog: MatDialog,
    private location: Location) {
    this.loadTicketsBetter();
    this.api.currentUserBalance.subscribe(balance => this.userBalance = parseInt(balance));
  }


  ngOnInit() {
    //set up countdown timer
    let endDate = this.api.auctionEndDate.getTime();
    let x = setInterval(() => {
      let now = new Date().getTime();
      let distance = endDate - now;
      // Time calculations for days, hours, minutes and seconds
      let days = Math.floor(distance / (1000 * 60 * 60 * 24));
      let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      let seconds = Math.floor((distance % (1000 * 60)) / 1000);
      // Display the result in the element with id="countdown"
      //if (this.location.path() == "/buy-tickets") {
        this.auctionMessage =  "Time Left For This Auction:\n" + days + "d " + hours + "h "
        + minutes + "m " + seconds + "s ";


      // If the count down is finished, write some text
        if (distance < 0) {
          clearInterval(x);
          this.auctionMessage = "Ticket Auction is No Longer in Progress";
        }
      //}
    }, 1000);
  }


   openDialog(ticket: PARecord): void {
    const dialogRef = this.dialog.open(BidComponent, {
      width: '250px',
      data: {bid: 0, ticket: ticket}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log("bid " + result + " on ticket: " + ticket.id);
        this.bidAuction(ticket.id, result);
      }
    });
  }

  openConfirmDialog(id: number, price: number): void {
    const dialogRef = this.dialog.open(ConfirmationComponent, {
      width: '250px',
      data: {for_sale: true, price: price}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.buyListing(id);
      }
    });
  }

  bidAuction(ticket_id: number, bid: number) {
    this.loadingBid = true;
    let auctionID: number;
    if (this.userBalance - bid < 0) {
      this.notifService.showNotif("You Do Not Have Enough Hokie Tokens", "OK")
      this.loadingBid = false;
    }
    else {
      this.api.getTable("auction").subscribe(table => {
        table.rows.forEach(element => {
          if (element.ticket_id == ticket_id) {
            auctionID = element.id;
          }
        });
        this.api.bidAuctionListing(bid, auctionID).subscribe(data => {
          this.loadTicketsBetter();
          this.loadingBid = false;
        });
      },
      err => {
        this.notifService.showNotif(err);
      });
    }
  }

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
    let newAuction: PARecord[] = [];
    if (this.checked) {
      this.auction.forEach(ticket => {
        if (ticket.highestBidder == this.api.currentUserValue) {
          newAuction.push(ticket);
        }
      });
      this.auctionDataSource = new MatTableDataSource(newAuction);
      this.auctionDataSource.sort = this.sort;
      this.auctionDataSource.paginator = this.paginator;
    }
    else {
      this.loadTicketsBetter();
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
    this.loadTicketsBetter();
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
      //Get listings
      this.api.getTable("listings").subscribe(listings => {
        tickets.rows.forEach(tix => {
          listings.rows.forEach(list => {
            if (list.ticket_id == tix.id) {
              tix.price = list.price;
              if (tix.owner != this.api.currentUserValue && tix.for_sale == 1) {
                this.listing.push(tix);
              }
            }
          });});
        this.listingDataSource = new MatTableDataSource(this.listing);
        this.listingDataSource.sort = this.sort;
        this.listingDataSource.paginator = this.paginator;
    },
    err => {
        this.notifService.showNotif(err);
    });
    //Get Auctions
    this.api.getTable("auction").subscribe(auction => {
        tickets.rows.forEach(tix => {
          auction.rows.forEach(auc => {
            if (auc.ticket_id == tix.id) {
              tix.price = auc.price;
              tix.highestBidder = auc.highest_bidder;
              if (tix.owner != this.api.currentUserValue && tix.for_auction == 1) {
                this.auction.push(tix);
              }
            }
          });});
        this.auctionDataSource = new MatTableDataSource(this.auction);
        this.auctionDataSource.sort = this.sort;
        this.auctionDataSource.paginator = this.paginator;
        this.isLoadingResults = false;
    },
    err => {
        this.notifService.showNotif(err);
    });
      },
      err => {this.notifService.showNotif(err, 'error')}
    );
    console.log("loaded tickets")
  }
}
