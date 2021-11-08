import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultAdminComponent } from './consult-admin.component';

describe('ConsultAdminComponent', () => {
  let component: ConsultAdminComponent;
  let fixture: ComponentFixture<ConsultAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultAdminComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
