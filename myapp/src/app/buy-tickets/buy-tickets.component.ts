import { Component, OnInit } from '@angular/core';
import {UserService} from '../_services/user.service';
import { PARecord } from '../_models/PARecord';
import {MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'app-buy-tickets',
  templateUrl: './buy-tickets.component.html',
  styleUrls: ['./buy-tickets.component.css']
})
export class BuyTicketsComponent implements OnInit {

  tickets: PARecord[] = [];
  tix = [{
      GameName: 'Football: VT vs. Miami',
      StadiumSection: "NORTH END ZONE",
      SportSeason: "Football 2019",
      Location: "Lane Statium Worsham",
      GameDate: new Date(),
      Section: 15,
      Row: 22,
      Seat: 18
    },
      {
        GameName: 'Football: VT vs. Miami',
        StadiumSection: "NORTH END ZONE",
        SportSeason: "Football 2019",
        Location: "Lane Statium Worsham",
        GameDate: new Date(),
        Section: 15,
        Row: 22,
        Seat: 18
      }];
  displayedColumns: string[] = ["GameName", "Section", "SportSeason"]
  dataSource: MatTableDataSource<PARecord>;
  dataSource2 = new MatTableDataSource(this.tix);

  constructor(private userService:UserService) {
    this.userService.getActivities().subscribe(
      tickets => {this.tickets = tickets}
      );
      this.dataSource = new MatTableDataSource(this.tickets);
  }

  ngOnInit() {

  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLocaleLowerCase();
  }

}
