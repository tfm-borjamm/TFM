import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/app/user/models/user.model';
import { AuthService } from 'src/app/user/services/auth.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
})
export class SidenavComponent implements OnInit {
  @Input() public user: User;

  constructor() {}

  ngOnInit(): void {
    console.log('SIDENAV ACTIVADO');
  }
}
