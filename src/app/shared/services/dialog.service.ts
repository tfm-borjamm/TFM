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

  confirm(message: string): Promise<boolean> {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      panelClass: 'dialog__confirm',
      data: {
        message: message,
      },
    });
    return dialogRef.afterClosed().pipe(take(1)).toPromise();
  }

  openButtonsDialog(options: any): void {
    this.dialog.open(SocialDialogComponent, {
      data: {
        options: options,
      },
    });
  }
}
