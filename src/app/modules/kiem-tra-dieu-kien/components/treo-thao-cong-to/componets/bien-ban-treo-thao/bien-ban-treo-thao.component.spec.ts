import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BienBanTreoThaoComponent } from './bien-ban-treo-thao.component';

describe('BienBanTreoThaoComponent', () => {
  let component: BienBanTreoThaoComponent;
  let fixture: ComponentFixture<BienBanTreoThaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BienBanTreoThaoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BienBanTreoThaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
