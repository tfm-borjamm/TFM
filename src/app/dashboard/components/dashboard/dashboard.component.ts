import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import * as moment from 'moment';
import { Color, Label } from 'ng2-charts';
import { Consult } from 'src/app/shared/models/consult.model';
import { ConsultService } from 'src/app/shared/services/consult.service';
import { Publication } from 'src/app/shared/models/publication.model';
import { FavoriteService } from 'src/app/shared/services/favorite.service';
import { PublicationService } from 'src/app/shared/services/publication.service';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { User } from 'src/app/shared/models/user.model';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  public countPublications: number;
  public countFavorites: number;
  public countUsers: number;
  public countConsults: number;

  public publications: Publication[];
  public users: User[];
  public consults: Consult[];

  public lineChartDataPublications: ChartDataSets[] = [{ data: [], label: '' }];
  public lineChartDataUsers: ChartDataSets[] = [{ data: [], label: '' }];
  public lineChartDataConsults: ChartDataSets[] = [{ data: [], label: '' }];

  public lineChartColorsPublications: Color[] = [];
  public lineChartColorsUsers: Color[] = [];
  public lineChartColorsConsults: Color[] = [];

  public lineChartLabels: Label[] = [];
  public lineChartOptions = {};
  public lineChartLegend = true;
  public lineChartType: ChartType = 'line';
  // lineChartPlugins: any = [];

  public chartTypes = ['bar', 'line'];

  constructor(
    private consultService: ConsultService,
    private publicationService: PublicationService,
    private userService: UserService,
    private favoriteService: FavoriteService,
    private utilsService: UtilsService,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.setNameLabels();
    this.setOptionsChart();
    this.setColorChart();
    this.setCountsGeneral();
  }

  async setCountsGeneral(): Promise<void> {
    const totalCounts = await Promise.all([
      this.consultService.getAllConsults(),
      this.publicationService.getAllPublications(),
      this.publicationService.getAllPublicationsHistory(),
      this.userService.getAllUsers(),
      this.favoriteService.getAllFavorites(),
    ]).catch((e) => this.utilsService.errorHandling(e));

    if (totalCounts) {
      const countArray = totalCounts.map((count) => this.utilsService.getArrayFromObject(count));
      const filterArray = countArray.map((i) => i.filter((i) => i).length);
      const [consults, publications, history, users, favorites] = filterArray;
      this.countFavorites = favorites;
      this.countPublications = publications + history;
      this.countUsers = users;
      this.countConsults = consults;

      this.getChartData();
    }
  }

  setNameLabels(): void {
    this.lineChartDataPublications[0].label = this.translateService.instant('publications');
    this.lineChartDataConsults[0].label = this.translateService.instant('consults');
    this.lineChartDataUsers[0].label = this.translateService.instant('users');
  }

  setOptionsChart(): void {
    this.lineChartOptions = {
      responsive: true,
      // title: {
      //   display: true,
      //   text: 'Última semana',
      // },
      scales: {
        xAxes: [
          {
            ticks: {
              // reverse: true,
              autoSkip: false,
              stepSize: 1,
            },
          },
        ],
        yAxes: [
          {
            ticks: {
              autoSkip: false,
              stepSize: 10,
              suggestedMax: 100,
              beginAtZero: true,
            },
          },
        ],
      },
    };
  }

  setColorChart(): void {
    this.lineChartColorsPublications = [
      {
        borderColor: 'rgba(63, 81, 181, 1)',
        backgroundColor: 'rgba(63, 81, 181, 0.4)',
      },
    ];

    this.lineChartColorsConsults = [
      {
        borderColor: 'rgba(244, 67, 54, 1)',
        backgroundColor: 'rgba(244, 67, 54, 0.4)',
      },
    ];

    this.lineChartColorsUsers = [
      {
        borderColor: 'rgba(255, 64, 129, 1)',
        backgroundColor: 'rgba(255, 64, 129, 0.4)',
      },
    ];
  }

  dateToMidnight(timestamp: number): number {
    // new Date(servertime.timestamp).setHours(24, 0, 0, 0);
    return moment(timestamp).set({ hours: 24, minutes: 0, seconds: 0, millisecond: 0 }).unix() * 1000;
  }

  async getChartData(): Promise<void> {
    const servertime = await this.utilsService.getServerTimeStamp().catch((e) => this.utilsService.errorHandling(e));
    if (servertime) {
      const ONE_DAY_TIMESTAMP = 86400000;
      for (let i = 0; i < 7; i++) {
        const date = moment(servertime.timestamp - ONE_DAY_TIMESTAMP * i)
          .locale(this.translateService.currentLang)
          .format('D MMM');
        this.lineChartLabels.push(date);
      }

      this.lineChartLabels.reverse();

      const timestamp = this.dateToMidnight(servertime.timestamp);
      const datasets = await Promise.all([
        this.publicationService.getPublicationsLastSevenDays(timestamp),
        this.consultService.getConsultsLastSevenDays(timestamp),
        this.userService.getUserLastSevenDays(timestamp),
      ]).catch((e) => this.utilsService.errorHandling(e));

      if (datasets && datasets.length === 3) {
        this.publications = datasets[0];
        this.consults = datasets[1];
        this.users = datasets[2];
        console.log(this.users, this.publications);

        this.setDatasets(timestamp, ONE_DAY_TIMESTAMP);
      }
    }
  }

  setDatasets(currentTime: number, ONE_DAY_TIMESTAMP: number): void {
    const items = ['consults', 'users', 'publications'];

    items.forEach((name: string) => {
      let days: number[] = Array(7).fill(0);
      const dataset = name === 'consults' ? this.consults : name === 'publications' ? this.publications : this.users;
      dataset.forEach((data: any) => {
        let majorTimestamp = currentTime;
        let menorTimestamp = 0;
        const date = name === 'consults' ? data.creation_date : name === 'publications' ? data.date : data.added_date;
        days.forEach((_, idx) => {
          let acc = ONE_DAY_TIMESTAMP * (idx + 1);
          menorTimestamp = currentTime - acc;
          if (date >= menorTimestamp && date <= majorTimestamp) {
            days[idx]++;
          }
          majorTimestamp = menorTimestamp;
        });
      });

      if (name === 'consults') {
        this.lineChartDataConsults[0].data = days.reverse();
      } else if (name === 'publications') {
        this.lineChartDataPublications[0].data = days.reverse();
      } else {
        this.lineChartDataUsers[0].data = days.reverse();
      }
    });
  }
}
