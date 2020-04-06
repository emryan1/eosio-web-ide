import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NotificationService} from '../_services/notification.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { EosApiService } from '../_services/eos-api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm:FormGroup;
  loading = false;
  submitted = false;
  returnURL: string;
  error = '';

  constructor(private router:Router, private notif:NotificationService, private formbuilder:FormBuilder,
    private route:ActivatedRoute, private api:EosApiService) {
    //console.log(this.api.currentUserValue)
    if (this.api.currentUserValue) {
      this.router.navigate(['/']);
    }

  }




  ngOnInit(): void {
    this.loginForm = this.formbuilder.group({
      username:['',Validators.required],
      privateKey:['', [Validators.required, Validators.maxLength(51), Validators.minLength(51)]]
    })

    this.returnURL = this.route.snapshot.queryParams['returnURL']|| '/';
  }

  get form() {return this.loginForm.controls;}

  onSubmit() {
    this.submitted = true;

    //stop if the form isnt valid
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    //use eos api to login
    this.api.login(this.form.username.value, this.form.privateKey.value)
      .subscribe(data => {this.router.navigate([this.returnURL]);},
      err => {
        this.loading = false;
        this.error = err;
        this.notif.showNotif("Incorrect username or Private Key", 'ok');
      });

  }

}
