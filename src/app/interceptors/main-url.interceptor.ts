import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class MainUrlInterceptor implements HttpInterceptor {
  private readonly path: string =
    'https://www.thecocktaildb.com/api/json/v1/1/';

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    return next.handle(
      request.clone({
        url: `${this.path + request.url}`,
      }),
    );
  }
}
