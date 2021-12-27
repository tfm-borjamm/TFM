import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminConsultDetailsComponent } from './admin-consult-details.component';

describe('AdminConsultDetailsComponent', () => {
  let component: AdminConsultDetailsComponent;
  let fixture: ComponentFixture<AdminConsultDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminConsultDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminConsultDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
