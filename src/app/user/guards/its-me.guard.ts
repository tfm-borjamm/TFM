import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Role } from 'src/app/shared/enums/role.enum';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { UtilsService } from 'src/app/services/utils.service';

@Injectable({
  providedIn: 'root',
})
export class ItsMeGuard implements CanActivate {
  constructor(
    private userService: UserService,
    private authService: AuthService,
    private utilsService: UtilsService,
    private router: Router
  ) {}
  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    // return true;
    try {
      const id = route.params['id'];
      const uid = await this.authService.getCurrentUserUID();
      if (uid && id) {
        const role = await this.userService.getRoleUserById(uid);
        return uid === id || role === Role.admin ? true : this.router.navigate(['page-not-found']);
      }
      this.router.navigate(['page-not-found']);
      return false;
    } catch (e) {
      this.utilsService.errorHandling(e);
      this.router.navigate(['page-not-found']);
      return false;
    }
  }
}
