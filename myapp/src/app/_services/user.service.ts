
import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {NotificationService} from './notification.service';
import {PARecord} from '../_models/PARecord';


@Injectable({ providedIn: 'root' })
export class UserService {


  parecords: PARecord[];




  constructor(private notif: NotificationService) {

    this.parecords = [{
      game: 'Football: VT vs. Miami',
      stadium_section: "NORTH END ZONE",
      season: "Football 2019",
      location: "Lane Statium Worsham",
      date: new Date(),
      section: 15,
      row: 22,
      seat: 18
    },
      {
        game: 'Football: VT vs. Miami',
        stadium_section: "NORTH END ZONE",
        season: "Football 2019",
        location: "Lane Statium Worsham",
        date: new Date(),
        section: 15,
        row: 22,
        seat: 18
      }];

  }




  getActivities() {
    // const param = 'getCourse';
    console.log('getActivities()');

    return new Observable<PARecord[]>(subscriber => {
      if (this.parecords.length > 0) {
        setTimeout(() => {subscriber.next(this.parecords); }, 1000);
      } else {
        setTimeout(() => {subscriber.error('No courses in the DB. Create a new course.'); }, 1000);
      }

    });

  }
}
