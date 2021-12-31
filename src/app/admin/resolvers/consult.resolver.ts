import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { Consult } from '../../shared/models/consult.model';
import { ConsultService } from '../../shared/services/consult.service';

@Injectable({
  providedIn: 'root',
})
export class ConsultResolver implements Resolve<Consult> {
  constructor(private consultService: ConsultService, private router: Router, private utilsService: UtilsService) {}
  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<Consult> {
    const idConsult = route.params['id'];

    const consult = await this.consultService.getConsultById(idConsult).catch((e) => {
      this.router.navigate(['page-not-found']);
      this.utilsService.errorHandling(e);
    });

    if (consult) return consult;
    this.router.navigate(['page-not-found']);
    return null;
  }
}
