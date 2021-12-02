import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { codes } from 'src/app/user/helpers/codes';
import { provinces } from 'src/app/shared/helpers/provinces';
import { User } from '../../../shared/models/user.model';
import { AuthService } from '../../../shared/services/auth.service';
import { UserService } from '../../../shared/services/user.service';
import { checkEmail } from '../../../shared/validations/checkEmail.validator';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';
import { Role } from '../../../shared/enums/role.enum';
import { Route } from '@angular/compiler/src/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit, OnDestroy {
  public user: User;
  public currentUser: User;
  public userID: string;
  public subscription: Subscription;

  public isAdminUser: boolean;
  public isProfessionalUser: boolean;
  public isClientUser: boolean;
  public isCurrentUser: boolean;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private utilsService: UtilsService,
    private router: Router,
    public translateService: TranslateService
  ) {
    this.user = this.activatedRoute.snapshot.data.user;
    this.userID = this.user ? this.user.id : null;
  }

  async ngOnInit(): Promise<void> {
    try {
      const uid = await this.authService.getCurrentUserUID();
      if (uid) {
        if (this.userID) {
          this.isCurrentUser = this.userID === uid;
          if (!this.isCurrentUser) {
            this.currentUser = await this.userService.getUserById(uid);
            this.isAdminUser = this.currentUser.role === Role.admin;
          }
          this.isClientUser = this.user.role === Role.client;
        } else {
          this.isCurrentUser = true;
          this.user = await this.userService.getUserById(uid);
          this.isClientUser = this.user.role === Role.client;
        }
      } else {
        this.isClientUser = this.user.role === Role.client;
      }
      this.user.telephone = this.utilsService.getTelephoneComplete(this.user);
    } catch (e) {
      this.utilsService.errorHandling(e);
    }
  }

  onContactUser() {
    console.log('Contactar con: ', this.user);
    window.alert('Contactar con el autor\n - Email: ' + this.user.email + '\n - Teléfono: ' + this.user.telephone);
  }

  onEditUser() {
    this.router.navigate(['user', 'profile-form', this.user.id]);
  }

  ngOnDestroy() {
    // if (!this.subscription.closed) this.subscription.unsubscribe();
  }
}
