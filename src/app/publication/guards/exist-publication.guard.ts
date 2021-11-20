import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { State } from '../enums/state.enum';
import { PublicationService } from '../services/publication.service';

@Injectable({
  providedIn: 'root',
})
export class ExistPublicationGuard implements CanActivate {
  constructor(private router: Router, private publicationService: PublicationService) {}
  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    const id = route.params?.id;
    const statePublication = route.params?.state;
    const routePath = route.routeConfig?.path;
    const isDetailsComponent = routePath === ':state/details/:id';

    const isNotValidParamsDetails = isDetailsComponent && (!id || !statePublication);
    const isNotValidParamsForm = !isDetailsComponent && !id;

    if (isNotValidParamsDetails || isNotValidParamsForm) {
      console.log('DENEGADO POR NO INTRODUCIR LOS PARAMETROS CORRECTAMENTE');
      this.router.navigate(['no-results']);
      return false;
    }

    const isAdopted = statePublication === State.adopted;
    const url = isAdopted ? 'history' : 'publications';
    const publication = await this.publicationService.getPublicationById(id, url);
    if (!publication) {
      console.log('DENEGADO POR NO EXISTIR LA PUBLICACIÓN');
      this.router.navigate(['no-results']);
      return false;
    }

    console.log('ACEPTADA LA PETICIÓN');
    return true;
  }
}

// async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
//   this.publication = await this.publicationService.getPublicationById(route.params.id);
//   this.user = await this.authService.getCurrentUserLogged();
//   console.log('publication', this.publication, this.user);
//   const isAutor = this.publication.idAutor === this.user.id;
//   const isAdmin = this.user.role === Role.admin;
//   if (!this.publication || (!isAutor && !isAdmin)) {
//     // this.location.back();
//     console.log('DENEGADO: NO TIENES PERMISOS');
//     return false;
//   }

//   return true;
// }
