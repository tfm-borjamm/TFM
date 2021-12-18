import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private _snackBar: MatSnackBar, private translate: TranslateService) {}

  successNotification(
    message: string,
    action: string = 'close',
    config: MatSnackBarConfig = {
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
      duration: 8000,
      panelClass: ['snackbar__success'],
    }
  ): void {
    this._snackBar.open(this.translate.instant(message), this.translate.instant(action), config);
  }

  infoNotification(
    message: string,
    action: string = 'close',
    config: MatSnackBarConfig = {
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
      duration: 8000,
      panelClass: ['snackbar__info'],
    }
  ): void {
    this._snackBar.open(this.translate.instant(message), this.translate.instant(action), config);
  }

  errorNotification(
    message: string,
    action: string = 'close',
    config: MatSnackBarConfig = {
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
      duration: 8000,
      panelClass: ['snackbar__error'],
    }
  ): void {
    this._snackBar.open(this.translate.instant(message), this.translate.instant(action), config);
  }
}
