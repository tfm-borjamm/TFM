import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialButtonsBottomSheetComponent } from './social-buttons-bottom-sheet.component';

describe('SocialButtonsBottomSheetComponent', () => {
  let component: SocialButtonsBottomSheetComponent;
  let fixture: ComponentFixture<SocialButtonsBottomSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SocialButtonsBottomSheetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SocialButtonsBottomSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
