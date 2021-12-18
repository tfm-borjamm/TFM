import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { User } from '../../../shared/models/user.model';
import { AuthService } from '../../../shared/services/auth.service';
import { UserService } from '../../../shared/services/user.service';
import { Subscription } from 'rxjs';
import { Role } from '../../../shared/enums/role.enum';
import { TranslateService } from '@ngx-translate/core';
import { DialogService } from 'src/app/shared/services/dialog.service';

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

  public telephone: string;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private utilsService: UtilsService,
    private router: Router,
    public translateService: TranslateService,
    private dialogService: DialogService
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
      this.telephone = this.utilsService.getTelephoneComplete(this.user);
    } catch (e) {
      this.utilsService.errorHandling(e);
    }
  }

  onContactUser() {
    const options: any = {
      name: 'contact',
      author: this.user,
    };
    this.dialogService.openButtonsDialog(options);
  }

  onEditUser() {
    this.router.navigate(['user', 'profile-form', this.user.id]);
  }

  ngOnDestroy() {
    // if (!this.subscription.closed) this.subscription.unsubscribe();
  }
}
