import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { Role } from '../../enums/role.enum';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-admin',
  templateUrl: './user-admin.component.html',
  styleUrls: ['./user-admin.component.scss'],
})
export class UserAdminComponent implements OnInit, OnDestroy {
  public tabValue: string = null;
  public tab$: BehaviorSubject<string> = new BehaviorSubject(this.tabValue);
  public subscriptionTab: Subscription;
  public users: User[];

  constructor(private userService: UserService, private router: Router, private utilsService: UtilsService) {
    const menu = this.utilsService.getLocalStorage('menu');
    if (menu?.tab) {
      const isValueCorrect = Object.values(Role).includes(menu?.tab);
      this.tabValue = isValueCorrect ? menu?.tab : Role.client;
      if (!isValueCorrect) this.utilsService.setLocalStorage('menu', { tab: this.tabValue });
    }
    // this.tabValue = menu?.tab ?? Role.client;
    // this.activatedRoute.queryParams.subscribe((params) => {
    //   console.log('PARAMS DE LA URL');
    //   this.tabValue = params.tab ?? Role.client;
    // });
  }

  ngOnInit(): void {
    this.subscriptionTab = this.tab$.subscribe((tab) => {
      console.log('Se ha cambiado el TAB a: ', tab);
      if (tab && tab !== this.tabValue) {
        console.log('SE CARGAN NUEVAS USUARIOS!');
        this.utilsService.setLocalStorage('menu', { tab: tab });
        this.loadUsers(tab);
        this.tabValue = tab;
        // this.router.navigate([], {
        //   relativeTo: this.activatedRoute,
        //   queryParams: { tab: this.tabValue },
        // });
      }
    });
    this.loadUsers(this.tabValue); // Sólo se ejecuta inicialmente!
  }

  async loadUsers(tabMenu: string): Promise<void> {
    this.users = await this.userService.getUsersAdmin(tabMenu);
  }

  ngOnDestroy(): void {
    if (!this.subscriptionTab.closed) {
      console.log('Destruimos el subscribe');
      this.subscriptionTab.unsubscribe();
    }
  }
}
