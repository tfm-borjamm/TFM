import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/app/user/models/user.model';
import { UtilsService } from '../../services/utils.service';

@Component({
  selector: 'app-contact-buttons',
  templateUrl: './contact-buttons.component.html',
  styleUrls: ['./contact-buttons.component.scss'],
})
export class ContactButtonsComponent implements OnInit {
  @Input() public author: User;
  constructor(private utilsService: UtilsService) {}

  ngOnInit(): void {
    this.author.telephone = this.utilsService.getTelephoneComplete(this.author);
  }

  encode(message: string): string {
    return encodeURI(message);
  }
}
