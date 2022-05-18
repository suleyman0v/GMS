import { Injectable } from '@angular/core';
import { BehaviorSubject, pipe, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { User } from '../../model/auth/user';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { ReqResService } from '../req-res.service';
import { JwtHelperService } from '@auth0/angular-jwt';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  helper = new JwtHelperService();
  constructor(private http: HttpClient, private router: Router, private reqRes: ReqResService) {
  }
  login(userDetails) {
    return this.reqRes.postData('/auth/login', userDetails).pipe(map(response => {
      if (response.islogin == 1) {
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('userinfo', JSON.stringify(response.userinfo));
      }
      return response;
    }))
  }
  setUserData(userDetails) {
    localStorage.setItem('userinfo', JSON.stringify(userDetails));
  }
  public isAuthenticated(): boolean {
    const token = localStorage.getItem('authToken');
    return !this.helper.isTokenExpired(token);
  }
  getuserid(): number {
    if (localStorage.getItem('userinfo')) {
      return JSON.parse(localStorage.getItem('userinfo'))[0].id;
    }
  }
  lastName(): string {
    if (localStorage.getItem('userinfo')) {
      return JSON.parse(localStorage.getItem('userinfo'))[0].lastName;
    }
  }
  firstName(): string {
    if (localStorage.getItem('userinfo')) {
      return JSON.parse(localStorage.getItem('userinfo'))[0].firstName;
    }
  }
  image(): string {
    if (localStorage.getItem('userinfo')) {
      return JSON.parse(localStorage.getItem('userinfo'))[0].imgPath;
    }
  }
  typeid(): number {
    if (localStorage.getItem('userinfo')) {
      return JSON.parse(localStorage.getItem('userinfo'))[0].typeid;
    }
  }
  position(): string {
    if (localStorage.getItem('userinfo')) {
      return JSON.parse(localStorage.getItem('userinfo'))[0].position;
    }
  }
  companyImage(): string {
    if (localStorage.getItem('userinfo')) {
      return JSON.parse(localStorage.getItem('userinfo'))[0].companyImage;
    }
  }
  companyName(): string {
    if (localStorage.getItem('userinfo')) {
      return JSON.parse(localStorage.getItem('userinfo'))[0].companyName;
    }
  }
  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userinfo');
    this.router.navigate(['/login']);
  }
}
