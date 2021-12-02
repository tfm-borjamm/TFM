import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/app/shared/models/user.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { UtilsService } from '../../services/utils.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
})
export class SidenavComponent implements OnInit {
  @Input() public user: User;

  constructor(private utilsService: UtilsService) {}

  ngOnInit(): void {
    console.log('SIDENAV ACTIVADO');
  }

  resetMenuTabs() {
    this.utilsService.removeLocalStorage('menu');
  }
}
