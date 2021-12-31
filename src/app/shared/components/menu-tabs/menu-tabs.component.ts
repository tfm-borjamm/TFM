import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Role } from '../../enums/role.enum';
import { UtilsService } from '../../services/utils.service';

@Component({
  selector: 'app-menu-tabs',
  templateUrl: './menu-tabs.component.html',
  styleUrls: ['./menu-tabs.component.scss'],
})
export class MenuTabsComponent implements OnInit {
  @Input() public links: string[];
  @Output() public newLinkEvent = new EventEmitter();
  public activeLink: string;

  constructor(private utilsService: UtilsService) {}

  ngOnInit(): void {
    const menu = this.utilsService.getLocalStorage('menu') ?? { link: 'default' };

    if (menu?.link) {
      const isValueCorrect = this.links.includes(menu.link);
      this.activeLink = isValueCorrect ? menu.link : this.links[0];
      if (!isValueCorrect) this.utilsService.setLocalStorage('menu', { link: this.activeLink });
    }

    this.newLinkEvent.emit(this.activeLink);
  }

  onChangeButton(link: string) {
    if (this.activeLink !== link) {
      this.utilsService.setLocalStorage('menu', { link: link });
      this.activeLink = link;
      this.newLinkEvent.emit(link);
    }
  }
}
