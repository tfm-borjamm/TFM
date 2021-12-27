import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthService } from 'src/app/shared/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.authService.getCurrentUser().pipe(
      take(1),
      map((auth) => {
        if (auth) {
          console.log('ACEPTADO: USUARIO AUTENTICADO');
          return true;
        }
        console.log('DENEGADO: USUARIO NO AUTENTICADO');
        this.router.navigate(['access', 'login']);
        return false;
      })
    );
  }
}
