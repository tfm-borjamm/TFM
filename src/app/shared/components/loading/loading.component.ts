import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
})
export class LoadingComponent implements OnInit {
  @Input() public diameter: number = 80;
  @Input() public display: string = 'block';
  @Input() public color: string;
  constructor() {}

  ngOnInit(): void {}
}
