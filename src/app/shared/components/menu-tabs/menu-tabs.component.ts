import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Role } from '../../enums/role.enum';
import { UtilsService } from '../../services/utils.service';

@Component({
  selector: 'app-menu-tabs',
  templateUrl: './menu-tabs.component.html',
  styleUrls: ['./menu-tabs.component.scss'],
})
export class MenuTabsComponent implements OnInit, OnDestroy {
  @Input() links: string[];
  // @Input() defaultLink: string;
  @Output() newLinkEvent = new EventEmitter();

  public activeLink: string;
  // public tab$: BehaviorSubject<string> = new BehaviorSubject(this.activeLink);
  // public subscriptionTab: Subscription;

  // public tab1: string;
  // public tab2: string;

  // links = ['First', 'Second', 'Third'];
  // activeLink = this.links[0];
  // background: ThemePalette = undefined;

  constructor(private utilsService: UtilsService) {}

  ngOnInit(): void {
    // const [tab1, tab2] = this.links;
    // this.tab1 = tab1;
    // this.tab2 = tab2;

    const menu = this.utilsService.getLocalStorage('menu') ?? { link: 'default' };

    if (menu?.link) {
      const isValueCorrect = this.links.includes(menu.link);
      this.activeLink = isValueCorrect ? menu.link : this.links[0];
      if (!isValueCorrect) this.utilsService.setLocalStorage('menu', { link: this.activeLink });
    }

    // console.log('tabs', this.activeLink, tab1, tab2);

    // this.subscriptionTab = this.tab$.subscribe((tab: string) => {
    //   console.log('Se ha cambiado el filter a: ', tab);
    //   if (tab && tab !== this.activeLink) {
    //     this.utilsService.setLocalStorage('menu', { tab: tab });
    //     this.activeLink = tab;
    //     this.newLinkEvent.emit(tab);
    //   }
    // });
    this.newLinkEvent.emit(this.activeLink);
  }

  onChangeButton(link: string) {
    // this.tab$.next(tab);
    console.log('Se ha cambiado el filter a: ', link);
    if (this.activeLink !== link) {
      this.utilsService.setLocalStorage('menu', { link: link });
      this.activeLink = link;
      this.newLinkEvent.emit(link);
    }
  }

  ngOnDestroy(): void {
    // if (!this.subscriptionTab.closed) {
    //   console.log('Destruimos el subscribe');
    //   this.subscriptionTab.unsubscribe();
    // }
  }
}
