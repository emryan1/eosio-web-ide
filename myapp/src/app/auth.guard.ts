import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate, Router} from '@angular/router';
import { Observable } from 'rxjs';
import {NotificationService} from './_services/notification.service';
import { EosApiService } from './_services/eos-api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
        private router: Router,
        private notif: NotificationService,
        private api: EosApiService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot,) {
        //need to get the user from api service from blockchain
        const currentUser = this.api.currentUserValue;
        if (currentUser) {
            // check if route is admin and if its not the admin account logged in redirect
            if (currentUser != "Hokietokacc") {
                // role not authorised so redirect to home page
                //this.notif.showNotif('Not authorized!', 'error');
               //this.router.navigate(['/']);
               // return false;
            }

            // authorised so return true
            return true;
        }

        // not logged in so redirect to login page with the return url
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        return false;
    }
}
