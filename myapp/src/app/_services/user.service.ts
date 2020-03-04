
import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {NotificationService} from './notification.service';
import {PARecord} from '../_models/PARecord';


@Injectable({ providedIn: 'root' })
export class UserService {


  parecords: PARecord[];




  constructor(private notif: NotificationService) {

    this.parecords = [{
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
