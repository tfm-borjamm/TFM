import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Role } from 'src/app/shared/enums/role.enum';
import { AuthService } from 'src/app/shared/services/auth.service';
import { UserService } from 'src/app/shared/services/user.service';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { PublicationService } from '../../shared/services/publication.service';

@Injectable({
  providedIn: 'root',
})
export class IsOwnerGuard implements CanActivate {
  constructor(
    private publicationService: PublicationService,
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private utilsService: UtilsService
  ) {}
  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    try {
      const id = route.params['id'];
      const uid = await this.authService.getCurrentUserUID();
      if (id && uid) {
        const publication = await this.publicationService.getPublicationById(id);
        const role = await this.userService.getRoleUserById(uid);
        if (publication && role) {
          return publication.idAuthor === uid || role === Role.admin ? true : this.router.navigate(['page-not-found']);
        }
      }
      this.router.navigate(['page-not-found']);
      return false;
    } catch (e) {
      this.router.navigate(['page-not-found']);
      this.utilsService.errorHandling(e);
      return false;
    }
  }
}
