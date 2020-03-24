import { Component, AfterViewInit, ViewChild, OnInit } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {UserService} from '../_services/user.service';
import { PARecord } from '../_models/PARecord';
import {MatTableDataSource} from '@angular/material/table';
import {NotificationService} from '../_services/notification.service'

@Component({
  selector: 'app-buy-tickets',
  templateUrl: './buy-tickets.component.html',
  styleUrls: ['./buy-tickets.component.css']
})
export class BuyTicketsComponent implements OnInit {

  tickets: PARecord[] = [{
      GameName: 'Football: VT vs. Miami',
      StadiumSection: "NORTH END ZONE",
      SportSeason: "Football 2019",
      Location: "Lane Statium Worsham",
      GameDate: new Date(),
      Section: 16,
      Row: 22,
      Seat: 18
    },
      {
        GameName: 'Football: VT vs. Clemson',
        StadiumSection: "NORTH END ZONE",
        SportSeason: "Football 2019",
        Location: "Lane Statium Worsham",
        GameDate: new Date(),
        Section: 22,
        Row: 22,
        Seat: 18
      }
    ,
      {
        GameName: 'Football: VT vs. Clemson',
        StadiumSection: "NORTH END ZONE",
        SportSeason: "Football 2019",
        Location: "Lane Statium Worsham",
        GameDate: new Date(),
        Section: 24,
        Row: 22,
        Seat: 18
      }];
  //Determines which coloums are shown in the table, add or remove if necessary
  displayedColumns: string[] = ["GameName", "StadiumSection", "SportSeason", "Location", "GameDate", "Section", "Row", "Seat"]
  dataSource: MatTableDataSource<PARecord>;
  isLoadingResults = false;
  resultsLength = 0;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(private userService:UserService, private notifService:NotificationService) {

  }

  ngOnInit() {
    //If user changes the sort order reset to first page
    //this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    //Here we need to subscribe to a data stream from APIservice that will update with the tickets on the blockchain
    //and update the dataSource everytime it changes
    this.dataSource = new MatTableDataSource(this.tickets);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLocaleLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
