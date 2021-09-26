import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../common/user.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private env: string = environment.base_url;
  constructor(private _http: HttpClient) {}

  register(data: Observable<User>) {
    return this._http.post(this.env + '/api/auth/signup', data);
  }

  login(data: object) {
    return this._http.post(this.env + '/api/auth/login', data);
  }

  loggedUser() {
    return this._http.get(this.env + '/api/auth/me', this.authHeader());
  }

  setToken(token: string) {
    return localStorage.setItem('x-web-token', token);
  }

  header(token: any) {
    let requestOptions: Object = {
      headers: new HttpHeaders().append('x-auth-token', token),
      responseType: 'JSON',
    };

    return requestOptions;
  }

  authHeader() {
    let hasToken = this.getToken();
    return this.header(hasToken);
  }

  getToken() {
    return localStorage.getItem('x-web-token');
  }

  removeToken() {
    return localStorage.removeItem('x-web-token');
  }

  passwordChecker(password: string, confirmPassword: string) {
    let msg!: string;
    let classMsg;
    if (password !== confirmPassword || !password || !confirmPassword) {
      msg = `password doesn't matched`;
      classMsg = 'alert-danger';
    } else {
      msg = `password matched`;
      classMsg = 'alert-success';
    }
    return { msg, classMsg };
  }
}
