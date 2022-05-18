import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from '../model/auth/user';
import { AuthService } from '../service/auth/auth.service';
import { ReqResService } from '../service/req-res.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService, private reqRes: ReqResService) {
  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.authService.isAuthenticated()) {
      let page = next.url?.length == 0 ? '' : next.url[0].path;
      this.reqRes.getData('/Global/CheckPageOpe/' + page).subscribe(
        data => {
          let permissionOpe = data.permissionOpe;
          if (permissionOpe == 0) {
            this.router.navigate(['/error403']);
          }
        },
        error => { console.log(error); this.router.navigate(['/error403']); }
      )
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }
}
