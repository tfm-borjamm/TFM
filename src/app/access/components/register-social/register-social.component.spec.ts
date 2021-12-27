import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterSocialComponent } from './register-social.component';

describe('RegisterSocialComponent', () => {
  let component: RegisterSocialComponent;
  let fixture: ComponentFixture<RegisterSocialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisterSocialComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterSocialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
