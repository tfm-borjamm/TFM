import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/app/user/models/user.model';

@Component({
  selector: 'app-contact-buttons',
  templateUrl: './contact-buttons.component.html',
  styleUrls: ['./contact-buttons.component.scss'],
})
export class ContactButtonsComponent implements OnInit {
  @Input() public author: User;
  constructor() {}

  ngOnInit(): void {}

  getTelephoneComplete(): string {
    const code = this.author.code.split(' ')[1].replace(/[{()}]/g, ''); // Numbercode
    return code + this.author.telephone;
  }

  encode(message: string): string {
    return encodeURI(message);
  }
}
