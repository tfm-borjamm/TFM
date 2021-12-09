import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { take } from 'rxjs/operators';
import { ConfirmDialogComponent } from '../components/confirm-dialog/confirm-dialog.component';
import { SocialDialogComponent } from '../components/social-dialog/social-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  constructor(private dialog: MatDialog) {}

  async confirm(message: string, width: string = 'auto'): Promise<boolean> {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: width,
      data: {
        message: message,
      },
    });
    return await dialogRef.afterClosed().pipe(take(1)).toPromise();
  }

  openButtonsDialog(options: any, width: string = 'auto'): void {
    this.dialog.open(SocialDialogComponent, {
      width: width,
      data: {
        options: options,
      },
    });
  }
}
