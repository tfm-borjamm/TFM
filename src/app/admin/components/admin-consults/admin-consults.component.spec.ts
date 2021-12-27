import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminConsultsComponent } from './admin-consults.component';

describe('AdminConsultsComponent', () => {
  let component: AdminConsultsComponent;
  let fixture: ComponentFixture<AdminConsultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminConsultsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminConsultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
