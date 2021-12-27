import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPublicationsComponent } from './admin-publications.component';

describe('AdminPublicationsComponent', () => {
  let component: AdminPublicationsComponent;
  let fixture: ComponentFixture<AdminPublicationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminPublicationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminPublicationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
