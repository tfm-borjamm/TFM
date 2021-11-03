import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-no-results',
  templateUrl: './no-results.component.html',
  styleUrls: ['./no-results.component.scss'],
})
export class NoResultsComponent implements OnInit {
  @Input() title: string;
  constructor() {}

  ngOnInit(): void {
    this.title = this.title ?? 'No se han encontrado resultados';
  }
}
