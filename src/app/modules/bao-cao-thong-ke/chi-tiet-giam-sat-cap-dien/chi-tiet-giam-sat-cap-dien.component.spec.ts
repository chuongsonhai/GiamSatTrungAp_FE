import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChiTietGiamSatCapDienComponent } from './chi-tiet-giam-sat-cap-dien.component';

describe('ChiTietGiamSatCapDienComponent', () => {
  let component: ChiTietGiamSatCapDienComponent;
  let fixture: ComponentFixture<ChiTietGiamSatCapDienComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChiTietGiamSatCapDienComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChiTietGiamSatCapDienComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
