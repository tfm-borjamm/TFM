import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { User } from 'src/app/shared/models/user.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { UtilsService } from '../../services/utils.service';
import { Router } from '@angular/router';
import { MediaMatcher } from '@angular/cdk/layout';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
})
export class SidenavComponent implements OnInit {
  @Input() public user: User;
  @Output() public snavStateOnChange = new EventEmitter();
  @Input() public mobileQuery: MediaQueryList;

  constructor(private utilsService: UtilsService, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {}

  resetMenuTabs() {
    this.utilsService.removeLocalStorage('menu');
  }

  onCloseSidenav() {
    if (this.mobileQuery.matches) this.snavStateOnChange.emit();
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['home']);
  }
}
