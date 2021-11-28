import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { State } from '../enums/state.enum';
import { Publication } from '../models/publication.model';
import { PublicationService } from '../services/publication.service';

@Injectable({
  providedIn: 'root',
})
export class PublicationResolver implements Resolve<Publication> {
  constructor(
    private publicationService: PublicationService,
    private router: Router,
    private utilsService: UtilsService
  ) {}
  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<Publication> {
    // return of(true);
    const statePublication = route.params['state'];
    const idPublication = route.params['id'];

    const isAdopted = statePublication === State.adopted;
    const url = isAdopted ? 'history' : 'publications';

    const publication = await this.publicationService.getPublicationById(idPublication, url).catch((e) => {
      this.router.navigate(['page-not-found']);
      this.utilsService.errorHandling(e);
    });

    if (publication) return publication;
    this.router.navigate(['page-not-found']);
    return null;
  }
}
