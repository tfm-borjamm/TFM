import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { User } from '../../shared/models/user.model';
import { UserService } from '../../shared/services/user.service';

@Injectable({
  providedIn: 'root',
})
export class UserResolver implements Resolve<User | void> {
  constructor(private userService: UserService, private router: Router, private utilsService: UtilsService) {}
  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<User | void> {
    // return of(true);
    const idUser = route.params['id'];

    const user = await this.userService.getUserById(idUser).catch((e) => {
      this.router.navigate(['page-not-found']);
      this.utilsService.errorHandling(e);
    });

    if (user) return user;
    this.router.navigate(['page-not-found']);
    return null;
  }
}
