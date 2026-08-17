import { Injectable, Injector, Provider } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services/authentication';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(
    private injector: Injector
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler):
      Observable<HttpEvent<any>> {
    var isAuthAPI: boolean;

    // Lazy-resolve to avoid a circular DI with TripDataService/HttpClient
    const authenticationService = this.injector.get(AuthenticationService);

    // console.log('Interceptor::URL' + request.url);
    if (request.url.startsWith('login') ||
        request.url.startsWith('register')) {
      isAuthAPI = true;
    }
    else {
      isAuthAPI = false;
    }

    if (authenticationService.isLoggedIn() && !isAuthAPI) {
      let token = authenticationService.getToken();
      // console.log(token);
      const authReq = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      return next.handle(authReq);
    }
    return next.handle(request);
  }
}

export const authInterceptProvider: Provider =
  { provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor, multi: true };
