import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable()

export class AuthGuard implements CanActivate {
  constructor(
    private auth: AuthService,
    private router: Router
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.auth.user$.pipe(
      //Auth guard uses authentication service to check if the user is logged in
      take(1),
      map(user => user ? true : false),
      tap(isLoggedIn => {
        if (!isLoggedIn) {
          //if user is not logged in
          this.router.navigate(['/login'])
          return false;
        }
        return true;
      })

    )
  }
}
