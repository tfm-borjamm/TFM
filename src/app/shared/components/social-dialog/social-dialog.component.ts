import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { User } from '../../models/user.model';
import { NotificationService } from '../../services/notification.service';
import { UtilsService } from '../../services/utils.service';

@Component({
  selector: 'app-social-dialog',
  templateUrl: './social-dialog.component.html',
  styleUrls: ['./social-dialog.component.scss'],
})
export class SocialDialogComponent implements OnInit {
  public option: string;

  public author: User;

  public shareLinkRelative: string;
  public origin: string;
  public shareLink: string;

  public FACEBOOK_ICON = '../../../../assets/images/facebook.svg';
  public TWITTER_ICON = '../../../../assets/images/twitter.svg';
  public WHATSAPP_ICON = '../../../../assets/images/whatsapp.svg';
  public COPY_ICON = '../../../../assets/images/copy.svg';

  public telephone: string;

  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private utilsService: UtilsService,
    private notificationService: NotificationService,
    public dialogRef: MatDialogRef<SocialDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    const { name } = data.options;
    this.option = name;
    if (this.option === 'share') {
      this.origin = document.location.origin;
      this.shareLinkRelative = data.options.shareLink;
      this.shareLink = encodeURI(this.origin + '/' + this.shareLinkRelative);
    } else {
      this.author = data.options.author;
      this.telephone = this.utilsService.getTelephoneComplete(this.author);
    }

    this.addIcons();
  }

  addIcons() {
    this.matIconRegistry.addSvgIcon('facebook', this.domSanitizer.bypassSecurityTrustResourceUrl(this.FACEBOOK_ICON));
    this.matIconRegistry.addSvgIcon('twitter', this.domSanitizer.bypassSecurityTrustResourceUrl(this.TWITTER_ICON));
    this.matIconRegistry.addSvgIcon('whatsapp', this.domSanitizer.bypassSecurityTrustResourceUrl(this.WHATSAPP_ICON));
    this.matIconRegistry.addSvgIcon('copy', this.domSanitizer.bypassSecurityTrustResourceUrl(this.COPY_ICON));
  }

  ngOnInit(): void {}

  encode(message: string): string {
    return encodeURI(message);
  }

  copyLinkToClipboard(): void {
    navigator.clipboard
      .writeText(this.shareLink)
      .then(() => this.notificationService.successNotification('Se ha copiado correctamente el enlace'))
      .catch((e) => this.utilsService.errorHandling(e));
  }

  onDismiss(): void {
    this.dialogRef.close();
  }
}
