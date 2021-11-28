import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Role } from 'src/app/user/enums/role.enum';
import { AuthService } from 'src/app/user/services/auth.service';
import { PublicationService } from '../services/publication.service';

@Injectable({
  providedIn: 'root',
})
export class IsOwnerGuard implements CanActivate {
  constructor(
    private publicationService: PublicationService,
    private authService: AuthService,
    private router: Router
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // return true;

    return this.authService.getCurrentUserLogged().then(async (user) => {
      const id = route.params['id'];
      if (!id) {
        this.router.navigate(['page-not-found']);
        return false;
      }
      const publication = await this.publicationService.getPublicationById(id);
      if (!publication) {
        this.router.navigate(['page-not-found']);
        return false;
      }
      return publication.idAutor === user.id ? true : this.router.navigate(['page-not-found']);
    });
  }
}
