import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Role } from 'src/app/user/enums/role.enum';
import { AuthService } from 'src/app/user/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class IsClientGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // return true;
    return this.authService
      .getCurrentUserLogged()
      .then(({ role }) => (role === Role.client ? true : this.router.navigate(['no-results'])));
  }
}
