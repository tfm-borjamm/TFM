import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { ConsultState } from '../../../shared/enums/consult-state.enum';
import { Consult } from '../../../shared/models/consult.model';
import { ConsultService } from '../../../shared/services/consult.service';

@Component({
  selector: 'app-consult-admin',
  templateUrl: './consult-admin.component.html',
  styleUrls: ['./consult-admin.component.scss'],
})
export class ConsultAdminComponent implements OnInit, OnDestroy {
  public consults: Consult[];

  public defaultTab = ConsultState.unread;
  public tabs = Object.values(ConsultState).splice(1); // Admin not

  displayedColumns: string[] = ['name', 'email', 'subject', 'message', 'date', 'star'];
  dataSource: any = new MatTableDataSource<Consult>([]);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  // @ViewChild(MatSort) sort: MatSort;

  public showFilter: boolean = false;

  constructor(private consultService: ConsultService, private router: Router, private utilsService: UtilsService) {
    const search = this.utilsService.getLocalStorage('search');
    const params = search;
    if (params) {
      this.dataSource.filter = params.search;
      // this.showFilter = true;
    }
  }

  ngOnInit(): void {}

  async loadConsults(filter: string): Promise<void> {
    console.log('Se cargan las consultas!');
    this.consults = await this.consultService.getConsults(filter);
    // Pagination is comming soon!
    this.dataSource.data = this.consults;
    this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
  }

  onDetailsConsult(id: string) {
    this.router.navigate([`/dashboard/consult/details/${id}`]);
  }

  applyFilter(event: Event): void {
    // Filter name search
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.utilsService.setLocalStorage('search', {
      search: this.dataSource.filter,
    });

    // if (this.dataSource.paginator) {
    //   this.dataSource.paginator.firstPage();
    // }

    // this.name = filterValue.toLowerCase();
    // this.users = this.name ? this.usersV0.filter((user) => this.isEqualNames(user.name, this.name)) : this.usersV0;
  }

  resetFilter() {
    this.dataSource.filter = '';
    this.utilsService.removeLocalStorage('search');
  }

  onDeleteConsult(id: string) {
    console.log('Eliminar: ', id);
    this.consultService
      .deleteConsult(id)
      .then(() => {
        this.consults = this.consults.filter((consult) => consult.id !== id);
        // this.loadConsults(this.tabValue) // Hacerlo local
      })
      .catch((e) => this.utilsService.errorHandling(e));
  }

  onMarkAsRead(id: string) {
    console.log('Marcar como leído: ', id);
    this.consultService
      .setState(id, ConsultState.read)
      .then(() => {
        this.consults.find((consult) => consult.id === id).state = ConsultState.read;
        // this.loadConsults(this.tabValue); // Hacerlo local
      })
      .catch((e) => this.utilsService.errorHandling(e));
  }

  ngOnDestroy(): void {}
}
