import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {PARecord} from '../_models/PARecord';
import {NotificationService} from '../_services/notification.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'parecord-component',
  templateUrl: './parecord.component.html',
  styleUrls: ['./parecord.component.css']
})
export class ParecordComponent implements OnInit {
  @Input() parecord: PARecord;

  constructor(private notifService: NotificationService) {
  }

  notImplemented(message) {

    this.notifService.notImplementedWarning(message);
  }

  ngOnInit() {

  }
}
