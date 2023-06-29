import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BienBanTTComponent } from './bien-ban-tt.component';

describe('BienBanTTComponent', () => {
  let component: BienBanTTComponent;
  let fixture: ComponentFixture<BienBanTTComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BienBanTTComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BienBanTTComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
