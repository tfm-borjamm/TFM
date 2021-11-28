import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { Role } from 'src/app/user/enums/role.enum';
import { AuthService } from 'src/app/user/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class HavePermissionsGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router, private utilsService: UtilsService) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // return true;
    return this.authService
      .getCurrentUserLogged()
      .then(({ role }) =>
        role === Role.professional || role === Role.admin ? true : this.router.navigate(['page-not-found'])
      );
  }
}
