import { NgModule } from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import {MaterialModule} from './material-module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {ErrorInterceptor} from './interceptors/error.interceptor';
import {ParecordComponent} from './parecord/parecord.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { ViewTicketsComponent } from './view-tickets/view-tickets.component';
import { BuyTicketsComponent } from './buy-tickets/buy-tickets.component';
import { SellTicketsComponent } from './sell-tickets/sell-tickets.component';
import { AdminComponent } from './admin/admin.component';
import { BidComponent } from './bid/bid.component';
import { NgCircleProgressModule } from 'ng-circle-progress-day-countdown';
import { ConfirmationComponent } from './confirmation/confirmation.component';


@NgModule({
  declarations: [
    AppComponent,
    ViewTicketsComponent,
    ParecordComponent,
    HomeComponent,
    LoginComponent,
    BuyTicketsComponent,
    SellTicketsComponent,
    AdminComponent,
    BidComponent,
    ConfirmationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }],
  bootstrap: [AppComponent],
  entryComponents: [BidComponent, ConfirmationComponent]
})
export class AppModule { }
