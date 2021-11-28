import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { codes } from 'src/app/user/helpers/codes';
import { provinces } from 'src/app/shared/helpers/provinces';
import { User } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { checkEmail } from '../../../shared/validations/checkEmail.validator';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';
import { Role } from '../../enums/role.enum';
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
  public isCurrentUser: boolean = true;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private utilsService: UtilsService,
    private router: Router,
    public translateService: TranslateService
  ) {
    this.user = this.activatedRoute.snapshot.data.user;
    if (this.user) this.userID = this.user.id;
    // this.subscription = this.activatedRoute.params.subscribe((params) => {
    //   this.userID = params.id;
    // });
  }

  async ngOnInit(): Promise<void> {
    // 1º comprobar si entramos al perfil de un usuario o si a nuestro perfil
    let currentUID = await this.authService.getCurrentUserUID().catch((e) => this.utilsService.errorHandling(e));
    currentUID = currentUID ? currentUID : null;
    if (this.userID) this.isCurrentUser = this.userID === currentUID; // El perfil es mio desde details

    if (this.userID && !this.isCurrentUser) {
      // const user = await this.userService.getUserById(this.userID).catch((e) => this.utilsService.errorHandling(e));
      // this.user = user ? user : null;
      const current = await this.userService.getUserById(currentUID).catch((e) => this.utilsService.errorHandling(e));
      this.currentUser = current ? current : null;
      this.isAdminUser = this.currentUser.role === Role.admin;
    } else {
      const user = await this.userService.getUserById(currentUID).catch((e) => this.utilsService.errorHandling(e));
      this.user = user ? user : null;
      this.isClientUser = this.user.role === Role.client;
    }

    this.user.telephone = this.utilsService.getTelephoneComplete(this.user);
  }

  // getTelephoneComplete(): string {
  //   const code = this.user.code.split(' ')[1].replace(/[{()}]/g, ''); // Numbercode
  //   return code + this.user.telephone;
  // }

  onContactUser() {
    console.log('Disparador del bottom sheet');
  }

  onEditUser() {
    this.router.navigate(['user', 'profile-form', this.user.id]);
  }

  ngOnDestroy() {
    // if (!this.subscription.closed) this.subscription.unsubscribe();
  }
}
