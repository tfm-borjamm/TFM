import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private _snackBar: MatSnackBar, private translate: TranslateService) {}

  sendNotification(
    message: string,
    action: string = 'close',
    position: MatSnackBarConfig = {
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
      duration: 3000,
    }
  ) {
    this._snackBar.open(this.translate.instant(message), this.translate.instant(action), position);
  }
}
