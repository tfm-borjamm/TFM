import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/app/user/models/user.model';
import { AuthService } from 'src/app/user/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Input() public user: User;
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    console.log('HEADER', this.user);
  }

  onLogout(): void {
    console.log('Sesión cerrada');
    this.authService.logout();
  }
}
