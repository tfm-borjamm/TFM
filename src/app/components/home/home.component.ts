import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { Type } from 'src/app/shared/enums/type.enum';
import { provinces } from 'src/app/shared/helpers/provinces';
import { User } from 'src/app/shared/models/user.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { UtilsService } from 'src/app/shared/services/utils.service';

interface filterSelected {
  filter: string;
  value: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  public onChangeFilterSubject: Subject<void> = new Subject<void>();

  // public idLastItem: string = null;
  // public limitItems: number = 6;

  public filterPublication: FormGroup;
  public province: FormControl;
  public type: FormControl;

  // public publications: any[] = [];

  // public finished: boolean = false;
  public types: string[] = Object.values(Type);
  public provinces: string[] = provinces;

  // public currentURL: string;
  // public queryDB: string;

  public paramType: string = null;
  public paramProvince: string = null;

  // public links = ['available', 'adopteds'];

  public showFilter: boolean;

  // public itemsLoaded: Promise<boolean>;

  constructor(
    private utilsService: UtilsService,
    private formBuilder: FormBuilder,
    private router: Router,
    private cdRef: ChangeDetectorRef
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    const filterPublications = this.utilsService.getLocalStorage('filterPublications');
    const params = filterPublications;
    if (params) {
      const isTypeOK = Object.values(Type).includes(params?.type);
      const isProvinceOK = provinces.includes(params?.province);
      this.paramType = isTypeOK ? params?.type : null;
      this.paramProvince = isProvinceOK ? params?.province : null;
      this.showFilter = Boolean(this.paramType || this.paramProvince);
    }
    // console.log('PARAMS: ', this.paramProvince, this.paramType);
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges(); // Valor del buscador
  }

  ngOnInit(): void {
    console.log('HOME');
    this.loadForm();
    // if (this.paramType || this.paramProvince) this.onChangeFilter();
  }

  loadForm(): void {
    this.type = new FormControl(this.paramType ?? '');
    this.province = new FormControl(this.paramProvince ?? '');
    this.filterPublication = this.createForm();
  }

  createForm(): FormGroup {
    return this.formBuilder.group({
      type: this.type,
      province: this.province,
    });
  }

  resetFilter() {
    this.type.setValue('');
    this.province.setValue('');
    this.utilsService.removeLocalStorage('filterPublications');
    this.onChangeFilterSubject.next();
  }

  async onChangeFilter(selected?: filterSelected) {
    const search: any = {
      type: this.filterPublication.value.type,
      province: this.filterPublication.value.province,
    };

    if (selected) {
      const { filter, value } = selected;
      search[filter] = value;
    }

    console.log('Search: ', search);

    if (search.type && search.province) {
      const query = {
        type: search.type,
        province: search.province,
      };
      this.utilsService.setLocalStorage('filterPublications', query);
    } else if (search.type) {
      const query = {
        type: search.type,
      };
      this.utilsService.setLocalStorage('filterPublications', query);
    } else if (search.province) {
      const query = {
        province: search.province,
      };
      this.utilsService.setLocalStorage('filterPublications', query);
    } else {
      this.utilsService.removeLocalStorage('filterPublications');
    }

    this.onChangeFilterSubject.next();
  }

  ngOnDestroy(): void {}
}
