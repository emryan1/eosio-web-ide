import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { EosApiService } from '../_services/eos-api.service';
import {NotificationService} from '../_services/notification.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private eosApiService: EosApiService, private notif: NotificationService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {


    return next.handle(request).pipe(catchError(err => {
      if ([401, 403].indexOf(err.status) !== -1) {
        // auto logout if 401 Unauthorized or 403 Forbidden response returned from api

        this.eosApiService.logout();
        location.reload(true);
      }
      if ([400, 501, 502, 503].indexOf(err.status) !== -1){
        this.notif.showNotif(err.error.message, 'error', 1000);

      }

      const error = err.error.message || err.statusText;

      return throwError(error);
    }));
  }
}
