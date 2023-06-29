import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BienBanKiemTraComponent } from './bien-ban-kiem-tra.component';

describe('BienBanKiemTraComponent', () => {
  let component: BienBanKiemTraComponent;
  let fixture: ComponentFixture<BienBanKiemTraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BienBanKiemTraComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BienBanKiemTraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
