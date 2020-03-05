import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NotificationService} from '../_services/notification.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

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

  constructor(private router:Router, private notif:NotificationService, private formbuilder:FormBuilder, private route:ActivatedRoute) {
    //need to redirect to home if already logged in
    //this.router.navigate(['/']);
  }




  ngOnInit(): void {
    this.loginForm = this.formbuilder.group({
      username:['',Validators.required],
      privateKey:['', Validators.required]
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
    //here we need to use the eos api to contact the blockchain and validate the user
    //for now:
    if (this.form.username.value == "User" && this.form.privateKey.value == "123") {
      this.router.navigate([this.returnURL]);
    }

  }

}
