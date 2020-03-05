import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ViewTicketsComponent} from './view-tickets/view-tickets.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import {AuthGuard} from './auth.guard'

const routes: Routes = [{path: 'view-tickets', component: ViewTicketsComponent, canActivate: [AuthGuard]},
{path: '', component: HomeComponent, canActivate: [AuthGuard]}, {path: 'login', component:LoginComponent},
{path:'**', component:HomeComponent}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
