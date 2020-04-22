import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { PARecord } from '../_models/PARecord';

export interface ConfirmData {
  for_sale: boolean;
  price: number;
}

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.css']
})
export class ConfirmationComponent implements OnInit {
  message: string;

  constructor(public dialogRef: MatDialogRef<ConfirmationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmData) {
      if (data.for_sale) {
        this.message = "Are you sure you want to buy this ticket for " + data.price + " HOK?";
      }
      else {
        this.message = "Are you sure you want to post this ticket for " + data.price+ " HOK?"
      }
     }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
  }

}
