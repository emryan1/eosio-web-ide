import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {NotificationService} from './_services/notification.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'myapp';

  constructor(private router:Router, private notif:NotificationService) {
    //Here we will need to use the eos api that we create to get information about the user
  }

  logout() {
    //need to call a logout function from a service we build either from eos or otherwise
    this.router.navigate(['/login'])
  }

}
