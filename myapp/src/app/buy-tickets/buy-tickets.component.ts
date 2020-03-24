import { Component, AfterViewInit } from '@angular/core';
import {UserService} from '../_services/user.service';
import { PARecord } from '../_models/PARecord';
import {MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'app-buy-tickets',
  templateUrl: './buy-tickets.component.html',
  styleUrls: ['./buy-tickets.component.css']
})
export class BuyTicketsComponent implements AfterViewInit {

  tickets: PARecord[] = [];
  tix: PARecord[] = [{
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
      }];
  displayedColumns: string[] = ["GameName", "StadiumSection", "SportSeason", "Location", "GameDate", "Section", "Row", "Seat"]
  dataSource: MatTableDataSource<PARecord>;
  dataSource2 = new MatTableDataSource(this.tix);
  isLoadingResults = false;

  constructor(private userService:UserService) {

  }

  ngAfterViewInit() {
    this.userService.getActivities().subscribe(
      tickets => {this.tickets = tickets}
      );
      this.dataSource = new MatTableDataSource(this.tickets);
      console.log
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLocaleLowerCase();
  }

}
