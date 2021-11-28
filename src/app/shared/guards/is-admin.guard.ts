import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Role } from 'src/app/user/enums/role.enum';
import { AuthService } from 'src/app/user/services/auth.service';
import { UtilsService } from '../services/utils.service';

@Injectable({
  providedIn: 'root',
})
export class IsAdminGuard implements CanActivate {
  // async canActivate(
  //   route: ActivatedRouteSnapshot,
  //   state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree ){
  //   // return true;
  //   return this.authService
  //     .getCurrentUserLogged()
  //     .then(({ role }) => (role === Role.admin ? true : this.router.navigate(['page-not-found'])));
  // }
  constructor(private authService: AuthService, private utilsService: UtilsService, private router: Router) {}

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    // return true;
    const { role } = await this.authService.getCurrentUserLogged();
    console.log('--->', role);
    if (role === Role.admin) return true;
    this.router.navigate(['page-not-found']);
    return false;
  }
}
