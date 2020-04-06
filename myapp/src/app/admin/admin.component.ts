import { Component, OnInit } from '@angular/core';
import {PARecord} from '../_models/PARecord'

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  private records: PARecord[];
  private record: PARecord;
  private numTix = 1;

  constructor() { }

  ngOnInit() {
  }

  temp(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;
  }

  setGame(event: Event) {
      const value = (event.target as HTMLInputElement).value;
      this.record.game = value;
  }

  setStadiumSection(event: Event) {
      const value = (event.target as HTMLInputElement).value;
      this.record.stadium_section = value;
  }

  setSeason(event: Event) {
      const value = (event.target as HTMLInputElement).value;
      this.record.season = value;
  }

  setLocation(event: Event) {
      const value = (event.target as HTMLInputElement).value;
      this.record.location = value;
  }

  setDate(event: Event) {
      const value = (event.target as HTMLInputElement).value;
      this.record.date = new Date(value);
  }

  setSection(event: Event) {
      const value = (event.target as HTMLInputElement).value;
      this.record.section = parseInt(value);
  }

  setRow(event: Event) {
      const value = (event.target as HTMLInputElement).value;
      this.record.row = parseInt(value);
  }
}
