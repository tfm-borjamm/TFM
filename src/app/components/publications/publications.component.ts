import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';
import { User } from 'src/app/shared/models/user.model';

@Component({
  selector: 'app-publications',
  templateUrl: './publications.component.html',
  styleUrls: ['./publications.component.scss'],
})
export class PublicationsComponent implements OnInit {
  public links = ['available', 'adopteds'];
  public onChangeTabSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  public user: User;

  constructor(private router: Router) {}

  ngOnInit(): void {}

  onChangeTab(link: string) {
    if (link === 'adopteds') link = link.substring(0, link.length - 1);
    this.onChangeTabSubject.next(link);
  }

  onCreatePublication() {
    this.router.navigate(['publication']);
  }
}
