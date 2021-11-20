import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { UtilsService } from '../../services/utils.service';

@Component({
  selector: 'app-menu-tabs',
  templateUrl: './menu-tabs.component.html',
  styleUrls: ['./menu-tabs.component.scss'],
})
export class MenuTabsComponent implements OnInit, OnDestroy {
  @Input() tabs: string[];
  @Input() defaultTab: string;
  @Output() newTabEvent = new EventEmitter();

  public tabValue: string = null;
  public tab$: BehaviorSubject<string> = new BehaviorSubject(this.tabValue);
  public subscriptionTab: Subscription;

  public tab1: string;
  public tab2: string;

  constructor(private utilsService: UtilsService) {}

  ngOnInit(): void {
    const [tab1, tab2] = this.tabs;
    this.tab1 = tab1;
    this.tab2 = tab2;

    const menu = this.utilsService.getLocalStorage('menu') ?? { tab: 'default' };

    if (menu?.tab) {
      const isValueCorrect = this.tabs.includes(menu?.tab);
      this.tabValue = isValueCorrect ? menu?.tab : this.defaultTab;
      if (!isValueCorrect) this.utilsService.setLocalStorage('menu', { tab: this.tabValue });
    }

    console.log('tabs', this.tabValue, tab1, tab2);

    this.subscriptionTab = this.tab$.subscribe((tab: string) => {
      console.log('Se ha cambiado el filter a: ', tab);
      if (tab && tab !== this.tabValue) {
        this.utilsService.setLocalStorage('menu', { tab: tab });
        this.tabValue = tab;
        this.newTabEvent.emit(tab);
      }
    });
    this.newTabEvent.emit(this.tabValue);
  }

  onChangeButton(tab: string) {
    this.tab$.next(tab);
  }

  ngOnDestroy(): void {
    if (!this.subscriptionTab.closed) {
      console.log('Destruimos el subscribe');
      this.subscriptionTab.unsubscribe();
    }
  }
}
