import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface User {
  id?: string;
  firstName: string;
  lastName: string;
  username: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private env: string = environment.base_url;
  constructor(private _http: HttpClient) {}

  register(data: User) {
    return this._http.post(this.env + '/api/auth/signup', data);
  }

  authToken(token: string) {
    return localStorage.setItem('x-web-token', token);
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
