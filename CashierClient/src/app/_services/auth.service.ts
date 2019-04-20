import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpHeaderResponse, HttpParams } from '@angular/common/http';
import { pipe } from '@angular/core/src/render3/pipe';
import {map} from 'rxjs/operators';
import {JwtHelperService} from '@auth0/angular-jwt';
import {RequestOptions, Request, RequestMethod} from '@angular/http';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl = 'http://localhost:5000/api/auth/';
  jwtHelper = new JwtHelperService();
  decodedToken: any;

constructor(private http: HttpClient) { }



private _options = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };



login(model: any) {
  return this.http.post(this.baseUrl + 'login', model).pipe(
    map((response: any) => {
      const user = response;
      if (user) {
        localStorage.setItem('token', user.token);
        this.decodedToken = this.jwtHelper.decodeToken(user.token);
      }
    })
  );
}

register(model: any) {
  return this.http.post(this.baseUrl + 'register', model);
}

AddItem(model: any) {
  return this.http.post(this.baseUrl + 'addItem', model);
}

UpdateItem(model: any) {
  return this.http.put(this.baseUrl + 'UpdateItem', model);
}

DeleteItem(id: any) {
  return this.http.delete(this.baseUrl + 'DeleteItem/' + id);
}

DeleteTransaction(id: any) {
  return this.http.delete(this.baseUrl + 'DeleteTransaction/' + id);
}

GetItemId(model: any) {
  return this.http.post(this.baseUrl + 'GetItemId', model, this._options);
}

purchaseBasket(model: any) {
  return this.http.post('http://localhost:5000/api/auth/purchaseBasket', model, this._options);
}

loggedIn() {
  const token = localStorage.getItem('token');
  return !this.jwtHelper.isTokenExpired(token);
}

}
