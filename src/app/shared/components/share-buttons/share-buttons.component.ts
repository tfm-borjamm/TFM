import { Component, Input, OnInit } from '@angular/core';
import { UtilsService } from '../../services/utils.service';

@Component({
  selector: 'app-share-buttons',
  templateUrl: './share-buttons.component.html',
  styleUrls: ['./share-buttons.component.scss'],
})
export class ShareButtonsComponent implements OnInit {
  @Input() public shareLinkRelative: string;
  public origin: string;
  public shareLink: string;
  constructor(public utilsService: UtilsService) {}

  ngOnInit(): void {
    this.origin = document.location.origin;
    this.shareLink = encodeURI(this.origin + '/' + this.shareLinkRelative);
  }

  encode(message: string): string {
    return encodeURI(message);
  }

  copyLinkToClipboard(): void {
    navigator.clipboard
      .writeText(this.shareLink)
      .then(() => console.log('Se ha copiado correctamente'))
      .catch((e) => this.utilsService.errorHandling(e));
  }
}
