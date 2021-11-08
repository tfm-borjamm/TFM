import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultDetailsComponent } from './consult-details.component';

describe('ConsultDetailsComponent', () => {
  let component: ConsultDetailsComponent;
  let fixture: ComponentFixture<ConsultDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
